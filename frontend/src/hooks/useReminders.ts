// src/hooks/useReminders.ts
import { useMemo, useState } from "react";
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

//type RawReminder = Omit<Reminder, "daysLeft" | "expiryText">;

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

// NEW: mirrors calculateTimeRemaining but also returns an "upcoming"/"overdue" status label,
// which the full Reminders page needs for tab-filtering and status badges. Kept separate
// from calculateTimeRemaining so the original Dashboard-facing logic above is untouched.
const calculateStatus = (expiryDateString: string) => {
  const today = new Date("2026-07-22");
  const expiry = new Date(expiryDateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "overdue" as const,
      label: `${Math.abs(diffDays)} days ago`,
    };
  }

  return {
    status: "upcoming" as const,
    label: `in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
  };
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
// NEW: mock reminders for the full Reminders page table.
// TEMP: replace with real API data once a reminders endpoint exists.
// Kept separate from the original `rawReminders` state below so the
// Dashboard's existing empty-by-default behavior is not affected.
export type ReminderTab = "upcoming" | "overdue" | "all";

export const useReminders = () => {
  // Empty array ready for backend data integration
  const [rawReminders, setRawReminders] = useState<any[]>([
    {
      id: 1,
      title: "Vehicle Insurance Renewal",
      documentType: "Driver's License",
      documentNumber: "BU-485-7299",
      vehicleName: "Toyota Highlander",
      plateNumber: "ABE-234-XY",
      expiryDate: "2026-08-02",
      reminderDate: "2026-07-18",
      type: "insurance",
      icon: _identityCard,
    },
    {
      id: 2,
       title: "Driver's License Expiry",
      documentType: "Insurance",
      documentNumber: "INS-2024-44567",
      vehicleName: "Lexus RX350",
      plateNumber: "FST-543-LK",
      expiryDate: "2026-08-15",
      reminderDate: "2026-08-01",
      type: "identity",
      icon: _insuranceCard,
    },
    {
      id: 3,
      title: "Roadworthiness Test",
      documentType: "Insurance",
      documentNumber: "INS-2024-44567",
      vehicleName: "Honda Civic (XYZ-789-AB)",
      plateNumber: "FGH-123-LK",
      expiryDate: "2026-08-15", // Expiring further out
      reminderDate: "2026-08-07",
      type: "inspection",
      icon: _identityCard,
    },
    {
      id: 4,
      title: "Roadworthiness Test",
      documentType: "Insurance",
      documentNumber: "INS-2024-44567",
      vehicleName: "Honda Civic (XYZ-789-AB)",
      plateNumber: "FGH-123-LK",
      expiryDate: "2026-08-15", // Expiring further out
      reminderDate: "2026-08-07",
      type: "inspection",
      icon: _identityCard,
    },
    {
      id: 5,
      title: "Roadworthiness Test",
      documentType: "Insurance",
      documentNumber: "INS-2024-44567",
      vehicleName: "Honda Civic (XYZ-789-AB)",
      plateNumber: "FGH-123-LK",
      expiryDate: "2026-08-15", // Expiring further out
      reminderDate: "2026-08-07",
      type: "inspection",
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


  // ---------- NEW: everything below is additive for the full Reminders page ----------

  const deleteReminder = (id: string) => {
  setRawReminders((prev) => prev.filter((r) => r.id !== id));
};

  const [allRawReminders] = useState(rawReminders);
  const [activeTab, setActiveTab] = useState<ReminderTab>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const enrichedReminders = useMemo(
    () =>
      allRawReminders.map((r) => ({
        ...r,
        ...calculateStatus(r.expiryDate),
        expiryFormatted: formatDate(r.expiryDate),
        reminderFormatted: formatDate(r.reminderDate),
      })),
    [allRawReminders],
  );

  const upcomingReminders = enrichedReminders.filter(
    (r) => r.status === "upcoming",
  );
  const overdueReminders = enrichedReminders.filter(
    (r) => r.status === "overdue",
  );

  const filteredByTab =
    activeTab === "upcoming"
      ? upcomingReminders
      : activeTab === "overdue"
        ? overdueReminders
        : enrichedReminders;

  const filteredReminders = filteredByTab.filter(
    (r) =>
      r.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    reminders: sortedAndSlicedReminders,

    // NEW — for the full Reminders page
    allReminders: filteredReminders,
    reminderCounts: {
      upcoming: upcomingReminders.length,
      overdue: overdueReminders.length,
      total: enrichedReminders.length,
    },
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    deleteReminder,
  };
};
