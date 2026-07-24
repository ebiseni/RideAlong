// src/hooks/useReminders.ts
import { useState } from "react";
import _identityCard from "../assets/icons/identity-card.svg";
import _insuranceCard from "../assets/icons/shield-energy.svg";

// 1. Define the type here so both files can use it
export type Reminder = {
  id: string;
  title: string;
  vehicle: string;
  expiryDate: string; // "2026-08-15" format
  icon: string;
  daysLeft: number;
  expiryText: string;
};

type RawReminder = Omit<Reminder, "daysLeft" | "expiryText">;

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
  // 2. Type it as RawReminder[] and add dummy data to test
  const [rawReminders] = useState<RawReminder[]>([
    // DELETE THIS LATER. This is just to test if UI renders
    {
      id: "1",
      title: "Insurance Renewal",
      vehicle: "Toyota Corolla - ABC 123",
      expiryDate: "2026-08-10",
      icon: _insuranceCard,
    },
    {
      id: "2",
      title: "Road Worthiness",
      vehicle: "Honda Civic - XYZ 789",
      expiryDate: "2026-07-30",
      icon: _identityCard,
    },
  ]);

  const calculatedReminders: Reminder[] = rawReminders.map((reminder) => {
    const timeCalc = calculateTimeRemaining(reminder.expiryDate);
    return {
     ...reminder,
     ...timeCalc,
    };
  });

  const sortedAndSlicedReminders = calculatedReminders
   .sort((a, b) => a.daysLeft - b.daysLeft)
   .slice(0, 2);

  return {
    reminders: sortedAndSlicedReminders,
  };
};