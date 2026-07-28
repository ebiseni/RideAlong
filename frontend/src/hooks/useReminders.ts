// src/hooks/useReminders.ts
import { useMemo, useState } from "react";
import { useVehicles } from "./useVehicles";
import { useDocuments } from "./useDocuments";
import _identityCard from "../assets/icons/identity-card.svg";
import _insuranceCard from "../assets/icons/shield-energy.svg";

export type Reminder = {
  id: string;
  title: string;
  vehicle: string;
  expiryDate: string;
  icon: string;
  daysLeft: number;
  expiryText: string;
};

export type ReminderTab = "upcoming" | "overdue" | "all";

// TEMP: no icon/type field exists on DocumentItem yet, so we infer which
// icon to show from the document name. Replace with a real `type` field
// on DocumentItem once the backend document schema is confirmed.
const getIconForDocument = (documentName: string) => {
  const name = documentName.toLowerCase();
  if (name.includes("license") || name.includes("registration"))
    return _identityCard;
  if (name.includes("insurance")) return _insuranceCard;
  return _identityCard; // fallback
};

const calculateTimeRemaining = (expiryDateString: string) => {
  const today = new Date("2026-07-22");
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
    return { daysLeft: 0, expiryText: "Expires today" };
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

// Raw stored shape: reminders now reference vehicleId/documentId instead of
// duplicating vehicleName/documentType as hardcoded strings.
type RawReminder = {
  id: number;
  vehicleId: string;
  documentId: number;
  reminderType: "before" | "onExpiry";
  notifyDays: number;
  notificationMethods: ("inApp" | "email")[];
};

export const useReminders = () => {
  const { vehicles } = useVehicles();
  const { documents } = useDocuments();

  // TEMP: seeded referencing the mock vehicle/document ids from useVehicles
  // and useDocuments, so the table has data to render out of the box.
  const [rawReminders, setRawReminders] = useState<RawReminder[]>([
    {
      id: 1,
      vehicleId: "veh-1",
      documentId: 1,
      reminderType: "before",
      notifyDays: 30,
      notificationMethods: ["inApp"],
    },
    {
      id: 2,
      vehicleId: "veh-2",
      documentId: 2,
      reminderType: "before",
      notifyDays: 14,
      notificationMethods: ["inApp"],
    },
    {
      id: 3,
      vehicleId: "veh-3",
      documentId: 3,
      reminderType: "before",
      notifyDays: 7,
      notificationMethods: ["inApp", "email"],
    },
  ]);

  const deleteReminder = (id: number) => {
    setRawReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // NEW: called by CreateReminderModal's onCreate. Resolves the selected
  // document's expiryDate to compute reminderDate, then stores the reminder
  // by reference (vehicleId/documentId) rather than duplicating display strings.
  const addReminder = (data: {
    vehicleId: string;
    documentId: number;
    reminderType: "before" | "onExpiry";
    notifyDays: number;
    notificationMethods: ("inApp" | "email")[];
  }) => {
    const newId = Math.max(0, ...rawReminders.map((r) => r.id)) + 1;
    setRawReminders((prev) => [...prev, { id: newId, ...data }]);
  };

  // add alongside deleteReminder/addReminder
  const updateReminder = (
    id: number,
    data: {
      vehicleId: string;
      documentId: number;
      reminderType: "before" | "onExpiry";
      notifyDays: number;
      notificationMethods: ("inApp" | "email")[];
    },
  ) => {
    setRawReminders((prev) =>
      prev.map((r) => (r.id === id ? { id, ...data } : r)),
    );
  };

  // NEW: lets RemindersPage pull the raw (unresolved) fields for a reminder
  // so the edit modal can be pre-filled with vehicleId/documentId/etc.,
  // rather than the display-only strings enrichedReminders exposes.
  const getRawReminderById = (id: number) =>
    rawReminders.find((r) => r.id === id) ?? null;

  // Resolves a raw reminder (vehicleId/documentId) into full display data
  // by looking up the current vehicle/document lists. If a referenced
  // vehicle or document was deleted elsewhere, that reminder is filtered out
  // rather than crashing on undefined fields.
  const resolvedReminders = useMemo(() => {
    return rawReminders
      .map((r) => {
        const vehicle = vehicles.find((v) => v.id === r.vehicleId);
        const document = documents.find((d) => d.id === r.documentId);
        if (!vehicle || !document) return null;

        const expiryDate = document.expiryDate;
        const reminderDate =
          r.reminderType === "onExpiry"
            ? expiryDate
            : new Date(
                new Date(expiryDate).getTime() -
                  r.notifyDays * 24 * 60 * 60 * 1000,
              )
                .toISOString()
                .split("T")[0];

        return {
          id: r.id,
          vehicleName: vehicle.name,
          plateNumber: vehicle.plate,
          documentType: document.name,
          documentNumber: document.documentNumber ?? `DOC-${document.id}`, // fallback for older mock docs without one
          expiryDate,
          reminderDate,
          icon: getIconForDocument(document.name),
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [rawReminders, vehicles, documents]);

  const calculatedReminders: Reminder[] = resolvedReminders.map((reminder) => {
    const timeCalc = calculateTimeRemaining(reminder.expiryDate);
    return {
      id: String(reminder.id),
      title: reminder.documentType,
      vehicle: reminder.vehicleName,
      expiryDate: reminder.expiryDate,
      icon: reminder.icon,
      ...timeCalc,
    };
  });

  const sortedAndSlicedReminders = calculatedReminders
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 2);

  const [activeTab, setActiveTab] = useState<ReminderTab>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const enrichedReminders = useMemo(
    () =>
      resolvedReminders.map((r) => ({
        ...r,
        ...calculateStatus(r.expiryDate),
        expiryFormatted: formatDate(r.expiryDate),
        reminderFormatted: formatDate(r.reminderDate),
      })),
    [resolvedReminders],
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
    addReminder,
    updateReminder,
    getRawReminderById,
  };
};
