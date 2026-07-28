import { useState } from "react";

interface DocumentItem {
  id: number;
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
}

// TEMP: mock data to unblock the Create Reminder modal's Document dropdown
// until this hook is wired to real backend data. Remove once the backend
// document-list endpoint is confirmed and integrated.
const INITIAL_MOCK_DOCUMENTS: DocumentItem[] = [
  { id: 1, name: "Driver's License", expiryDate: "2026-08-02" },
  { id: 2, name: "Insurance", expiryDate: "2026-08-15" },
  { id: 3, name: "Vehicle Registration", expiryDate: "2026-06-10" },
  { id: 4, name: "Roadworthy Certificate", expiryDate: "2026-09-30" },
];

export const useDocuments = () => {
  // TEMP: seeded with mock data instead of empty array — swap back to
  // useState<DocumentItem[]>([]) once real backend data replaces this
  // FIX: was missing a setter, same bug pattern as the original useReminders —
  // no way for any other code to ever add/change documents.
  const [documentsData, setDocumentsData] = useState<DocumentItem[]>(
    INITIAL_MOCK_DOCUMENTS,
  );

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
  const addDocument = (
    name: string,
    expiryDate?: string,
    vehicleId?: string,
    file?: File,
  ) => {
    const newId = Math.max(0, ...documentsData.map((d) => d.id)) + 1;
    const fallbackExpiry = new Date();
    fallbackExpiry.setFullYear(fallbackExpiry.getFullYear() + 1);

    setDocumentsData((prev) => [
      ...prev,
      {
        id: newId,
        name,
        expiryDate: expiryDate ?? fallbackExpiry.toISOString().split("T")[0],
        vehicleId,
        frontImageUrl: file ? URL.createObjectURL(file) : undefined,
      },
    ]);

    return newId;
  };

  return {
    documents,
    validCount,
    expiringCount,
    expiredCount,
    expiringSubtext: getExpiringSubtext(),
    addDocument,
  };
};
