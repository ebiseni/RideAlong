import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
  doc,
  deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged,type User } from "firebase/auth";
import { db, auth } from "../api/firebase";
import { differenceInDays } from "date-fns";

// Helper: Convert file to base64 string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

// Data as it comes FROM firestore
type DocumentFromFirestore = {
  name: string;
  expiryDate: Timestamp | null;
  vehicleId?: string | null;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  documentNumber?: string | null;
  uid: string;
  createdAt: Timestamp;
}

export interface DocumentItem extends Omit<DocumentFromFirestore, "expiryDate"> {
  id: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired";
  diffDays: number;
}

export type NewDocumentInput = {
  name: string;
  expiryDate: string;
  vehicleId?: string;
  file?: File; // front
  backFile?: File | null; // FIX: allow null
  documentNumber?: string;
};

export const useDocuments = () => {
  const [documentsData, setDocumentsData] = useState<(DocumentFromFirestore & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!user) {
        setDocumentsData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const q = query(collection(db, "documents"), where("uid", "==", user.uid));

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
       ...(docSnap.data() as DocumentFromFirestore),
          }));
          setDocumentsData(docs);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching documents:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  const today = new Date();

  const documents: DocumentItem[] = documentsData.map((doc) => {
    const expDate = doc.expiryDate?.toDate();
    const diffDays = expDate? differenceInDays(expDate, today) : 999;

    let status: "valid" | "expiring" | "expired";
    if (diffDays < 0) status = "expired";
    else if (diffDays <= 30) status = "expiring";
    else status = "valid";

    return {
 ...doc,
      status,
      diffDays,
      expiryDate: expDate? expDate.toISOString().split("T")[0] : ""
    };
  });

  const validCount = documents.filter((d) => d.status === "valid").length;
  const expiredCount = documents.filter((d) => d.status === "expired").length;
  const expiringDocs = documents.filter((d) => d.status === "expiring");
  const expiringCount = expiringDocs.length;

  const getExpiringSubtext = () => {
    if (expiringDocs.length === 0) return "";
    const minDays = Math.min(...expiringDocs.map((d) => d.diffDays));
    if (minDays <= 0) return "Expiring today";
    return `Within ${minDays} ${minDays === 1? "day" : "days"}`;
  };

  const addDocument = async (data: NewDocumentInput) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    setUploading(true);
    try {
      const expiryTimestamp = data.expiryDate? Timestamp.fromDate(new Date(data.expiryDate)) : null;
      let frontUrl: string | null = null;
      let backUrl: string | null = null;

      // Convert front file to base64
      if (data.file) {
        if (data.file.size > 450 * 1024) {
          throw new Error("Front file too large. Max 450KB per image");
        }
        frontUrl = await fileToBase64(data.file);
      }

      // Convert back file to base64 - handle null
      if (data.backFile) {
        if (data.backFile.size > 450 * 1024) {
          throw new Error("Back file too large. Max 450KB per image");
        }
        backUrl = await fileToBase64(data.backFile);
      }

      await addDoc(collection(db, "documents"), {
        uid: user.uid,
        name: data.name,
        expiryDate: expiryTimestamp,
        vehicleId: data.vehicleId || null,
        documentNumber: data.documentNumber || null,
        frontImageUrl: frontUrl,
        backImageUrl: backUrl,
        createdAt: serverTimestamp(),
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, "documents", id));
  };

  return {
    documents,
    loading,
    uploading,
    validCount,
    expiringCount,
    expiredCount,
    expiringSubtext: getExpiringSubtext(),
    addDocument,
    deleteDocument,
  };
};