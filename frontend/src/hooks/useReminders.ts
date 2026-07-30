// src/hooks/useReminders.ts
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import { db, auth } from "../api/firebase";
import { useVehicles } from "./useVehicles";
import { useDocuments } from "./useDocuments";
import { differenceInCalendarDays, parseISO, format, subDays } from "date-fns";
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

const getIconForDocument = (documentName: string) => {
  const name = documentName.toLowerCase();
  if (name.includes("license") || name.includes("registration"))
    return _identityCard;
  if (name.includes("insurance")) return _insuranceCard;
  return _identityCard;
};

const getToday = () => new Date();

const getDaysFromToday = (dateString: string) => {
  const today = getToday();
  const date = parseISO(dateString);
  return differenceInCalendarDays(date, today);
};

const getTimeText = (diffDays: number, prefix: string) => {
  if (diffDays < 0) return `${prefix} ${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return `${prefix} today`;
  return `${prefix} in ${diffDays} day${diffDays === 1? "" : "s"}`;
};

const calculateStatus = (dateString: string) => {
  const diffDays = getDaysFromToday(dateString);
  if (diffDays < 0) {
    return { status: "overdue" as const, label: `${Math.abs(diffDays)} days ago` };
  }
  return { status: "upcoming" as const, label: `in ${diffDays} day${diffDays === 1? "" : "s"}` };
};

const formatDate = (dateString: string) =>
  format(parseISO(dateString), "d MMM yyyy");

type RawReminder = {
  id: string;
  vehicleId: string;
  documentId: string;
  reminderType: "before" | "onExpiry";
  notifyDays: number;
  notificationMethods: ("inApp" | "email")[];
  uid: string;
};

export const useReminders = () => {
  const { vehicles } = useVehicles();
  const { documents } = useDocuments();

  const [rawReminders, setRawReminders] = useState<RawReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!user) {
        setRawReminders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const q = query(collection(db, "reminders"), where("uid", "==", user.uid));

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const unique = new Map<string, RawReminder>();
          snapshot.docs.forEach((docSnap) => {
            unique.set(docSnap.id, {
            ...(docSnap.data() as Omit<RawReminder, "id">),
              id: docSnap.id,
            });
          });
          setRawReminders(Array.from(unique.values()));
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching reminders:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  const deleteReminder = async (id: string) => {
    await deleteDoc(doc(db, "reminders", id));
  };

  const addReminder = async (data: {
    vehicleId: string;
    documentId: string;
    reminderType: "before" | "onExpiry";
    notifyDays: number;
    notificationMethods: ("inApp" | "email")[];
  }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    await addDoc(collection(db, "reminders"), {
    ...data,
      uid: user.uid,
    });
  };

  const updateReminder = async (
    id: string,
    data: {
      vehicleId: string;
      documentId: string;
      reminderType: "before" | "onExpiry";
      notifyDays: number;
      notificationMethods: ("inApp" | "email")[];
    }
  ) => {
    await updateDoc(doc(db, "reminders", id), data);
  };

  const getRawReminderById = (id: string) =>
    rawReminders.find((r) => r.id === id)?? null;

  const resolvedReminders = useMemo(() => {
    return rawReminders
    .map((r) => {
        const vehicle = vehicles.find((v) => v.id === r.vehicleId);
        const document = documents.find((d) => d.id === r.documentId);
        if (!vehicle ||!document) return null;

        const expiryDate = document.expiryDate;
        const expiry = parseISO(expiryDate);

        const reminderDate =
          r.reminderType === "onExpiry"
          ? expiryDate
            : format(subDays(expiry, r.notifyDays), "yyyy-MM-dd");

        const expiryDaysLeft = getDaysFromToday(expiryDate);
        const reminderDaysLeft = getDaysFromToday(reminderDate);

        return {
        ...r, // FIX: spread first so id comes from r
          vehicleName: vehicle.name,
          plateNumber: vehicle.plate,
          documentType: document.name,
          documentNumber: document.documentNumber?? `DOC-${document.id}`,
          expiryDate,
          reminderDate,
          expiryDaysLeft,
          reminderDaysLeft,
          expiryText: getTimeText(expiryDaysLeft, "Expires"),
          reminderText: getTimeText(reminderDaysLeft, "Reminds"),
          icon: getIconForDocument(document.name),
        };
      })
    .filter((r): r is NonNullable<typeof r> => r!== null);
  }, [rawReminders, vehicles, documents]);

  const calculatedReminders: Reminder[] = resolvedReminders.map((reminder) => {
    return {
      id: reminder.id,
      title: reminder.documentType,
      vehicle: reminder.vehicleName,
      expiryDate: reminder.expiryDate,
      icon: reminder.icon,
      daysLeft: reminder.expiryDaysLeft,
      expiryText: reminder.expiryText,
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
        expiryDaysLabel: getTimeText(r.expiryDaysLeft, "Expires"),
        reminderDaysLabel: getTimeText(r.reminderDaysLeft, "Reminds"),
      })),
    [resolvedReminders]
  );

  const upcomingReminders = enrichedReminders.filter((r) => r.status === "upcoming");
  const overdueReminders = enrichedReminders.filter((r) => r.status === "overdue");

  const filteredByTab =
    activeTab === "upcoming"
    ? upcomingReminders
      : activeTab === "overdue"
    ? overdueReminders
      : enrichedReminders;

  const filteredReminders = filteredByTab.filter(
    (r) =>
      r.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
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
    loading,
  };
};