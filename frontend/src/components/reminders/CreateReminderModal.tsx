import { useState, useEffect } from "react";
import { useVehicles } from "../../hooks/useVehicles";
import { useDocuments } from "../../hooks/useDocuments";
import "../../styles/components/reminders/CreateReminderModal.css";

interface CreateReminderModalProps {
  onClose: () => void;
  onCreate: (data: {
    vehicleId: string;
    documentId: number;
    reminderType: "before" | "onExpiry";
    notifyDays: number;
    notificationMethods: ("inApp" | "email")[];
  }) => void;
}

const NOTIFY_OPTIONS = [45, 30, 14, 7, 1];

export default function CreateReminderModal({ onClose, onCreate }: CreateReminderModalProps) {
  const { vehicles } = useVehicles();
  const { documents } = useDocuments();

  const [vehicleId, setVehicleId] = useState("");
  const [documentId, setDocumentId] = useState(""); // select values are always strings
  const [reminderType, setReminderType] = useState<"before" | "onExpiry">("before");
  const [notifyDays, setNotifyDays] = useState(30);
  const [notificationMethods, setNotificationMethods] = useState<("inApp" | "email")[]>(["inApp"]);

  useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "";
  };
}, []);

  const toggleMethod = (method: "inApp" | "email") => {
    setNotificationMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = () => {
    if (!vehicleId || !documentId) return; // both are required selects, no-op if either is unset

    onCreate({
      vehicleId,
      documentId: Number(documentId), // convert back to number to match DocumentItem.id
      reminderType,
      notifyDays,
      notificationMethods,
    });
  };

  return (
    <div className="create-reminder-backdrop" onClick={onClose}>
      <div className="create-reminder-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="create-reminder-title">Create Reminder</h2>
        <p className="create-reminder-subtitle">
          Set a reminder so you'll never miss a document renewal.
        </p>

        <div className="create-reminder-row">
          <div className="create-reminder-field">
            <label>Vehicle</label>
            <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
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
            <select value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
              <option value="" disabled>
                Select document
              </option>
              {documents.map((d) => (
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
              />
              <p>Before Expiry</p>
            </label>
            <label className="create-reminder-radio">
              <input
                type="radio"
                name="reminderType"
                checked={reminderType === "onExpiry"}
                onChange={() => setReminderType("onExpiry")}
              />
              <p>On Expiry Date</p>
            </label>
          </div>
        </div>

        <div className="create-reminder-field">
          <label>Notify Me</label>
          <p className="create-reminder-hint">Choose when you want to be reminded.</p>
          <div className="create-reminder-pill-group">
            {NOTIFY_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                className={`create-reminder-pill ${notifyDays === days ? "active" : ""}`}
                onClick={() => setNotifyDays(days)}
              >
                {days} {days === 1 ? "Day" : "Days"}
              </button>
            ))}
          </div>
        </div>

        <div className="create-reminder-field">
          <label>Notification Method</label>
          <p className="create-reminder-hint">Select how you want to be reminded.</p>
          <div className="create-reminder-checkbox-group">
            <label className="create-reminder-checkbox">
              <input
                type="checkbox"
                checked={notificationMethods.includes("inApp")}
                onChange={() => toggleMethod("inApp")}
              />
              <p>In-app Notification</p>
            </label>
            <label className="create-reminder-checkbox">
              <input
                type="checkbox"
                checked={notificationMethods.includes("email")}
                onChange={() => toggleMethod("email")}
              />
              <p>Email</p>
            </label>
          </div>
        </div>

        <div className="create-reminder-actions">
          <button className="create-reminder-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-reminder-submit-btn" onClick={handleSubmit}>
            Create Reminder
          </button>
        </div>
      </div>
    </div>
  );
}