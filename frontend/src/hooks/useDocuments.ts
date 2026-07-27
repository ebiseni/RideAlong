import { useState } from "react";

interface DocumentItem {
  id: number;
  name: string;
  expiryDate: string;
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
  const [documentsData] = useState<DocumentItem[]>(INITIAL_MOCK_DOCUMENTS);

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

  return {
    documents,
    validCount,
    expiringCount,
    expiredCount,
    expiringSubtext: getExpiringSubtext(),
  };
};