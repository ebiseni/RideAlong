// src/hooks/useDocuments.ts
import { useState } from "react";

interface DocumentItem {
  id: number;
  name: string;
  status: "valid" | "expiring" | "expired";
  expiryDate: string;
}

export const useDocuments = () => {
  // Empty mock data array as requested
  const [documents] = useState<DocumentItem[]>([]);

  const validCount = documents.filter((d) => d.status === "valid").length;
  const expiredCount = documents.filter((d) => d.status === "expired").length;

  const expiringDocs = documents.filter((d) => d.status === "expiring");
  const expiringCount = expiringDocs.length;

  // dynamically calculate the shortest time until expiry for expiring documents

  const getExpiringSubtext = () => {
    if (expiringDocs.length === 0) return "";
    //   If there are expiring documents, calculate the minimum days until expiry
    const today = new Date();
    const daysArr = expiringDocs.map((doc) => {
      const expDate = new Date(doc.expiryDate);
      const diffTime = expDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });

    const minDays = Math.min(...daysArr);

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
