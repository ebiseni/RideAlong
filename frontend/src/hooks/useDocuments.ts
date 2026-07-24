import { useState } from "react";

interface DocumentItem {
  id: number;
  name: string;
  expiryDate: string;
}

export const useDocuments = () => {
  // Empty array ready for real backend data
  const [documentsData] = useState<DocumentItem[]>([]);

  const today = new Date();

  // Automatically calculate status based on expiryDate vs today
  const documents = documentsData.map((doc) => {
    const expDate = new Date(doc.expiryDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: "valid" | "expiring" | "expired" = "valid";

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
