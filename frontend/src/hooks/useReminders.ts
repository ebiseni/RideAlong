// src/hooks/useReminders.ts
import { useState } from "react";
import _identityCard from "../assets/icons/identity-card.svg";
import _insuranceCard from "../assets/icons/shield-energy.svg";

// Helper function to dynamically calculate the time remaining until a reminder's expiry date
const calculateTimeRemaining = (expiryDateString: string) => {
  const today = new Date("2026-07-22"); // Current date baseline
  const expiry = new Date(expiryDateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      daysLeft: 0,
      expiryText: `Expired ${Math.abs(diffDays)} days ago`,
    };
  }

  if (diffDays === 0) {
    return {
      daysLeft: 0,
      expiryText: "Expires today",
    };
  }

  return {
    daysLeft: diffDays,
    expiryText: `Expires on ${expiry.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`,
  };
};

export const useReminders = () => {
  // Empty array ready for backend data integration
  const [rawReminders] = useState<any[]>([]);

  // Dynamically compute daysLeft and expiry text for each reminder
  const calculatedReminders = rawReminders.map((reminder) => {
    const timeCalc = calculateTimeRemaining(reminder.expiryDate);
    return {
      ...reminder,
      ...timeCalc,
    };
  });

  // Sort by urgency (lowest daysLeft first) and take only the top 2 most urgent ones
  const sortedAndSlicedReminders = calculatedReminders
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 2);

  return {
    reminders: sortedAndSlicedReminders,
  };
};
