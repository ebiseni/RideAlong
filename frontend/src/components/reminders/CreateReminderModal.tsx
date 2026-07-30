import { useState, useEffect } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import { useDocuments } from "../../hooks/useDocuments";
import "../../styles/components/reminders/CreateReminderModal.css";

interface CreateReminderModalProps {
  onClose: () => void;
  onSave: (data: {
    vehicleId: string;
    documentId: string;
    reminderType: "before" | "onExpiry";
    notifyDays: number;
    notificationMethods: ("inApp" | "email")[];
  }) => void;
  initialData?: {
    vehicleId: string;
    documentId: string;
    reminderType: "before" | "onExpiry";
    notifyDays: number;
    notificationMethods: ("inApp" | "email")[];
  } | null;
  saving?: boolean;
}

const NOTIFY_OPTIONS = [45, 30, 14, 7, 1];

export default function CreateReminderModal({
  onClose,
  onSave,
  initialData,
  saving = false,
}: CreateReminderModalProps) {
  const { vehicles } = useVehicles();
  const { documents } = useDocuments();
  const isEditMode = Boolean(initialData);

  const [vehicleId, setVehicleId] = useState(initialData?.vehicleId?? "");
  const [documentId, setDocumentId] = useState(initialData?.documentId?? "");
  const [reminderType, setReminderType] = useState<"before" | "onExpiry">(
    initialData?.reminderType?? "before",
  );
  const [notifyDays, setNotifyDays] = useState(initialData?.notifyDays?? 30);
  const [notificationMethods, setNotificationMethods] = useState<
    ("inApp" | "email")[]
  >(initialData?.notificationMethods?? ["inApp"]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // REMOVED: useEffect that was setting documentId
  // FIX: Reset document when vehicle changes, inside onChange instead

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleId(e.target.value);
    setDocumentId(""); // reset here instead of in useEffect
  };

  const toggleMethod = (method: "inApp" | "email") => {
    setNotificationMethods((prev) =>
      prev.includes(method)
       ? prev.filter((m) => m!== method)
        : [...prev, method],
    );
  };

  const handleSubmit = async () => {
    if (!vehicleId ||!documentId || notificationMethods.length === 0) return;

    onSave({
      vehicleId,
      documentId,
      reminderType,
      notifyDays: reminderType === "onExpiry"? 0 : notifyDays,
      notificationMethods,
    });
  };

  // Only show docs for selected vehicle
  const filteredDocuments = vehicleId
   ? documents.filter((d) => d.vehicleId === vehicleId)
    : documents;

  return (
    <div className="create-reminder-backdrop" onClick={onClose}>
      <div
        className="create-reminder-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="create-reminder-title">
          {isEditMode? "Edit Reminder" : "Create Reminder"}
        </h2>
        <p className="create-reminder-subtitle">
          {isEditMode
           ? "Update the details for this reminder."
            : "Set a reminder so you'll never miss a document renewal."}
        </p>

        <div className="create-reminder-row">
          <div className="create-reminder-field">
            <label>Vehicle</label>
            <select
              value={vehicleId}
              onChange={handleVehicleChange} // FIX: use handler
              disabled={saving}
            >
              <option value="" disabled>
                Select vehicle
              </option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="create-reminder-field">
            <label>Document</label>
            <select
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              disabled={!vehicleId || saving}
            >
              <option value="" disabled>
                {vehicleId? "Select document" : "Select vehicle first"}
              </option>
              {filteredDocuments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="create-reminder-field">
          <label>Reminder Type</label>
          <div className="create-reminder-radio-group">
            <label className="create-reminder-radio">
              <input
                type="radio"
                name="reminderType"
                checked={reminderType === "before"}
                onChange={() => setReminderType("before")}
                disabled={saving}
              />
              <p>Before Expiry</p>
            </label>
            <label className="create-reminder-radio">
              <input
                type="radio"
                name="reminderType"
                checked={reminderType === "onExpiry"}
                onChange={() => setReminderType("onExpiry")}
                disabled={saving}
              />
              <p>On Expiry Date</p>
            </label>
          </div>
        </div>

        {reminderType === "before" && (
          <div className="create-reminder-field">
            <label>Notify Me</label>
            <p className="create-reminder-hint">
              Choose when you want to be reminded.
            </p>
            <div className="create-reminder-pill-group">
              {NOTIFY_OPTIONS.map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`create-reminder-pill ${notifyDays === days? "active" : ""}`}
                  onClick={() => setNotifyDays(days)}
                  disabled={saving}
                >
                  {days} {days === 1? "Day" : "Days"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="create-reminder-field">
          <label>Notification Method</label>
          <p className="create-reminder-hint">
            Select how you want to be reminded.
          </p>
          <div className="create-reminder-checkbox-group">
            <label className="create-reminder-checkbox">
              <input
                type="checkbox"
                checked={notificationMethods.includes("inApp")}
                onChange={() => toggleMethod("inApp")}
                disabled={saving}
              />
              <p>In-app Notification</p>
            </label>
            <label className="create-reminder-checkbox">
              <input
                type="checkbox"
                checked={notificationMethods.includes("email")}
                onChange={() => toggleMethod("email")}
                disabled={saving}
              />
              <p>Email</p>
            </label>
          </div>
        </div>

        <div className="create-reminder-actions">
          <button
            className="create-reminder-cancel-btn"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="create-reminder-submit-btn"
            onClick={handleSubmit}
            disabled={saving ||!vehicleId ||!documentId || notificationMethods.length === 0}
          >
            {saving? "Saving..." : isEditMode? "Save Changes" : "Create Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}