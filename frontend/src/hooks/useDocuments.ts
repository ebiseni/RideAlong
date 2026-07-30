import { useState, useEffect } from "react";

interface DocumentItem {
  id: string;
  name: string;
  expiryDate: string;
  vehicleId?: string; // NEW: links a document to a vehicle from useVehicles. Optional
  // since documents uploaded via the standalone /documents/add
  // flow (no vehicle context) won't have one.
  frontImageUrl?: string; // NEW: object URL created from the uploaded File.
  // Only persists for the current browser session —
  // object URLs are revoked on page reload, so this
  // is a stopgap until real file storage/upload to
  // a backend exists.
  documentNumber?: string; // NEW: e.g. license/policy/plate number, captured
  // at upload time. Optional since the 4 seeded
  // mock documents predate this field.
}

// TEMP: mock data to unblock the Create Reminder modal's Document dropdown
// until this hook is wired to real backend data. Remove once the backend
// document-list endpoint is confirmed and integrated.
// const INITIAL_MOCK_DOCUMENTS: DocumentItem[] = [
//   {
//     id: "1",
//     name: "Driver's License",
//     expiryDate: "2026-08-02",
//     documentNumber: "BU-485-7299",
//   },
//   {
//     id: "2",
//     name: "Insurance",
//     expiryDate: "2026-08-15",
//     documentNumber: "INS-2024-44567",
//   },
//   {
//     id: "3",
//     name: "Vehicle Registration",
//     expiryDate: "2026-06-10",
//     documentNumber: "REG-2023-11890",
//   },
//   {
//     id: "4",
//     name: "Roadworthy Certificate",
//     expiryDate: "2026-09-30",
//     documentNumber: "RW-2024-00321",
//   },
// ];

export const useDocuments = () => {
  // TEMP: seeded with mock data instead of empty array — swap back to
  // useState<DocumentItem[]>([]) once real backend data replaces this
  // FIX: was missing a setter, same bug pattern as the original useReminders —
  // no way for any other code to ever add/change documents.
 const [documentsData, setDocumentsData] = useState<DocumentItem[]>([]);
  const today = new Date();

  // Automatically calculate status based on expiryDate vs today
  const documents = documentsData.map((doc) => {
    const expDate = new Date(doc.expiryDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: "valid" | "expiring" | "expired";

    if (diffDays < 0) {
      status = "expired";
    } else if (diffDays <= 30) {
      status = "expiring";
    } else {
      status = "valid";
    }

    return { ...doc, status, diffDays };
  });

  const validCount = documents.filter((d) => d.status === "valid").length;
  const expiredCount = documents.filter((d) => d.status === "expired").length;

  const expiringDocs = documents.filter((d) => d.status === "expiring");
  const expiringCount = expiringDocs.length;

  const getExpiringSubtext = () => {
    if (expiringDocs.length === 0) return "";
    const minDays = Math.min(...expiringDocs.map((d) => d.diffDays));
    if (minDays <= 0) return "Expiring today";
    return `Within ${minDays} ${minDays === 1 ? "day" : "days"}`;
  };

  // NEW: called from AddDocumentsPage once a file upload completes.
  // TEMP: expiryDate has no real input source yet — nothing in the upload
  // flow captures it. Defaults to 1 year from today until an expiry-date
  // field is added to DocumentUploadModal or confirmed from the backend.
  // UPDATED: now accepts an optional vehicleId so uploads from
  // VehicleDetailPage can be tagged to that vehicle.
  // UPDATED: now accepts an optional File, converted to an object URL for
  // display on DocumentDetailPage. TEMP — object URLs don't survive a page
  // reload and there's no real backend upload yet.
const fetchDocuments = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:5000/api/documents", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const result: ApiDocument[] = await response.json();
  type ApiDocument = {
  id: string;
  documentType: string;
  documentNumber: string;
  expiryDate: string;
  vehicleId: string;
  file: string;
};
  setDocumentsData(
    
    result.map((doc: ApiDocument) => ({
      id: doc.id,
      name: doc.documentType,
      documentNumber: doc.documentNumber,
      expiryDate: doc.expiryDate,
      vehicleId: doc.vehicleId,
      frontImageUrl: doc.file,
    }))
  );
  
};
 const addDocument = async (
  expiryDate: string,
  vehicleId: string,
  file: File,
  documentNumber: string,
  documentType: string,
) => {
  const token = localStorage.getItem("accessToken");

  const formData = new FormData();

  formData.append("vehicleId", vehicleId);
  formData.append("documentNumber", documentNumber);
  formData.append("expiryDate", expiryDate);
  formData.append("documentType", documentType);
  formData.append("file", file);

  const response = await fetch(
    "http://localhost:5000/api/documents/add",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const result = await response.json();
  console.log(result);
  const newDocument: DocumentItem = {
  id: result.id,
  name: result.documentType,      
  documentNumber: result.documentNumber,
  expiryDate: result.expiryDate,
  frontImageUrl: result.file,
};

  setDocumentsData((prev) => [newDocument,...prev,]);

  return result;
};
useEffect(() => {
  fetchDocuments();
}, []);
  return {
    documents,
    validCount,
    expiringCount,
    expiredCount,
    expiringSubtext: getExpiringSubtext(),
    addDocument,
  };
};
