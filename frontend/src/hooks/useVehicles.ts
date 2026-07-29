// src/hooks/useVehicles.ts
import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  orderBy,
  Timestamp // 1. IMPORT Timestamp
} from "firebase/firestore";
import { auth, db } from "../api/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { differenceInCalendarDays, parseISO, format } from "date-fns";

export type VehicleDocument = {
  id: string;
  name: string;
  type: string;
  documentNumber?: string;
  expiryDate: string;
  expiryFormatted: string;
  daysLabel: string;
  status: "upcoming" | "overdue";
  daysLeft: number;
}

export type Vehicle = {
  id: string;
  uid: string;
  name: string;
  plate: string;
  documents: VehicleDocument[];
  documentCount: number;
  nextExpiryDate?: string;
  status: string;
  statusClass: "green" | "yellow" | "red";
  subText?: string;
  diffDays: number;
};

type RawVehicle = {
  id: string;
  uid: string;
  name: string;
  plate: string;
  documents: number;
  expiryDate?: string;
  createdAt?: Timestamp; // FIX: was any, now Timestamp
};

type RawDocument = {
  id: string;
  vehicleId: string;
  name: string;
  type: string;
  documentNumber?: string;
  expiryDate: string;
  uid: string;
}

export type NewVehicleInput = {
  vehicleNumber: string;
  make: string;
  model: string;
  year: string;
};

const getDaysFromToday = (dateString: string) => {
  const today = new Date();
  const date = parseISO(dateString);
  return differenceInCalendarDays(date, today);
};

const getTimeText = (diffDays: number) => {
  if (diffDays < 0) return `Expired ${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return `Expires today`;
  return `Expires in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
};

const calculateVehicleCompliance = (docs: VehicleDocument[]) => {
  if (docs.length === 0) {
    return {
      status: "No documents",
      statusClass: "green" as const,
      subText: "Add documents to track expiry",
      diffDays: Infinity,
      nextExpiryDate: undefined
    };
  }

  const sorted = [...docs].sort((a,b) => a.daysLeft - b.daysLeft);
  const worstDoc = sorted[0];
  const diffDays = worstDoc.daysLeft;

  let status: string, statusClass: "green" | "yellow" | "red", subText: string;

  if (diffDays < 0) {
    status = "Expired";
    statusClass = "red";
    subText = `${sorted.filter(d => d.status === "overdue").length} document${sorted.filter(d => d.status === "overdue").length === 1 ? "" : "s"} expired`;
  } else if (diffDays <= 30) {
    status = "Expiring Soon";
    statusClass = "yellow";
    subText = `${sorted.filter(d => d.status === "upcoming" && d.daysLeft <= 30).length} document expiring in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  } else {
    status = "Fully compliant";
    statusClass = "green";
    subText = "All documents valid";
  }

  return {
    status,
    statusClass,
    subText,
    diffDays,
    nextExpiryDate: worstDoc.expiryDate
  };
};

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeVehicles = () => {};
    let unsubscribeDocs = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      unsubscribeVehicles();
      unsubscribeDocs();

      if (!user) {
        setVehicles([]);
        setLoading(false);
        return;
      }

      const vehiclesQuery = query(
        collection(db, "vehicles"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const docsQuery = query(
        collection(db, "documents"),
        where("uid", "==", user.uid)
      );

      let rawVehicles: RawVehicle[] = [];
      let rawDocs: RawDocument[] = [];

      const processData = () => {
        const mappedVehicles: Vehicle[] = rawVehicles.map((vehicle) => {
          const vehicleDocsRaw = rawDocs.filter(d => d.vehicleId === vehicle.id);
          
          const vehicleDocuments: VehicleDocument[] = vehicleDocsRaw.map(d => {
            const daysLeft = getDaysFromToday(d.expiryDate);
            return {
              id: d.id,
              name: d.name,
              type: d.type,
              documentNumber: d.documentNumber,
              expiryDate: d.expiryDate,
              expiryFormatted: format(parseISO(d.expiryDate), "d MMM yyyy"),
              daysLeft,
              daysLabel: getTimeText(daysLeft),
              status: daysLeft < 0 ? "overdue" : "upcoming"
            }
          });

          const compliance = calculateVehicleCompliance(vehicleDocuments);

          return {
            id: vehicle.id,
            uid: vehicle.uid,
            name: vehicle.name,
            plate: vehicle.plate,
            documents: vehicleDocuments,
            documentCount: vehicleDocuments.length,
            ...compliance
          };
        });

        setVehicles(mappedVehicles);
        setLoading(false);
      };

      unsubscribeVehicles = onSnapshot(vehiclesQuery, 
        (snapshot) => {
          rawVehicles = snapshot.docs.map((docSnap) => ({
            ...(docSnap.data() as Omit<RawVehicle, "id">), // FIX: spread first
            id: docSnap.id,
          }));
          processData();
        }
      );

      unsubscribeDocs = onSnapshot(docsQuery,
        (snapshot) => {
          rawDocs = snapshot.docs.map((docSnap) => ({
            ...(docSnap.data() as Omit<RawDocument, "id">), // FIX: spread first
            id: docSnap.id,
          }));
          processData();
        }
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeVehicles();
      unsubscribeDocs();
    };
  }, []);

  const addVehicle = async (data: NewVehicleInput) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    await addDoc(collection(db, "vehicles"), {
      uid: user.uid,
      name: `${data.make} ${data.model}`,
      plate: data.vehicleNumber,
      createdAt: serverTimestamp()
    });
  };

  const deleteVehicle = async (id: string) => {
    await deleteDoc(doc(db, "vehicles", id));
  };

  const updateVehicle = async (id: string, updates: Partial<Omit<RawVehicle, "id" | "uid">>) => {
    await updateDoc(doc(db, "vehicles", id), updates);
  };

  const sortedAndSlicedVehicles = [...vehicles]
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 2);

  return {
    loading,
    totalVehicles: vehicles.length,
    vehicles: vehicles,
    dashboardVehicles: sortedAndSlicedVehicles,
    addVehicle,
    deleteVehicle,
    updateVehicle,
  };
};