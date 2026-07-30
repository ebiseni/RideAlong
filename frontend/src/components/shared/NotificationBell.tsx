import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/shared/NotificationBell.css";

interface ExpiringDocument {
  id: string;
  title: string;
  expiryDate: string;
  daysLeft: number;
  vehicleName?: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [urgentDocs, setUrgentDocs] = useState<ExpiringDocument[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Check if in-app notifications are enabled in settings
  const checkInAppEnabled = () => {
    const savedPrefs = localStorage.getItem("notificationPreferences");
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      return parsed.inApp ?? true;
    }
    return true;
  };

  // Load and sort the most urgent documents across storage
  useEffect(() => {
    try {
      const savedVehicles =
        localStorage.getItem("vehicles") ||
        localStorage.getItem("ridealong_vehicles");
      let allDocs: ExpiringDocument[] = [];

      if (savedVehicles) {
        const vehicles = JSON.parse(savedVehicles);
        vehicles.forEach((veh: any) => {
          if (veh.documents && Array.isArray(veh.documents)) {
            veh.documents.forEach((doc: any) => {
              const expiry = new Date(doc.expiryDate || doc.expiry);
              const today = new Date();
              const diffTime = expiry.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              allDocs.push({
                id: doc.id || Math.random().toString(),
                title: doc.documentType || doc.name || "Vehicle Document",
                expiryDate: doc.expiryDate || doc.expiry,
                daysLeft: diffDays,
                vehicleName: veh.name || veh.vehicleName || "Vehicle",
              });
            });
          }
        });
      }

      const standaloneDocs = localStorage.getItem("documents");
      if (standaloneDocs) {
        const docs = JSON.parse(standaloneDocs);
        docs.forEach((doc: any) => {
          const expiry = new Date(doc.expiryDate || doc.expiry);
          const today = new Date();
          const diffTime = expiry.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          allDocs.push({
            id: doc.id || Math.random().toString(),
            title: doc.documentType || doc.name || "Document",
            expiryDate: doc.expiryDate || doc.expiry,
            daysLeft: diffDays,
            vehicleName: doc.vehicleName || "General Document",
          });
        });
      }

      if (allDocs.length === 0) {
        allDocs = [
          {
            id: "1",
            title: "Car Insurance",
            expiryDate: "2026-08-01",
            daysLeft: 1,
            vehicleName: "G wagon Benz",
          },
          {
            id: "2",
            title: "Vehicle License",
            expiryDate: "2026-08-05",
            daysLeft: 5,
            vehicleName: "G wagon Benz",
          },
        ];
      }

      allDocs.sort((a, b) => a.daysLeft - b.daysLeft);
      setUrgentDocs(allDocs.slice(0, 2));
    } catch (err) {
      console.error("Error loading notification documents:", err);
    }
  }, [isOpen]);

  // Show indicator dot on the bell if there are urgent docs AND in-app notifications are enabled
  const showIndicator = urgentDocs.length > 0 && checkInAppEnabled();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setIsOpen(false);
    navigate("/documents");
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <div
        className="notification-bell-icon-wrapper"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {showIndicator && <span className="notification-indicator" />}
        <svg
          className="notification-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>

      {isOpen && (
        <div className="notification-dropdown-panel">
          <div className="notification-dropdown-header">
            <h4>Notifications</h4>
            <span className="notification-badge-count">Urgent</span>
          </div>

          <div className="notification-dropdown-list">
            {urgentDocs.length === 0 ? (
              <p className="no-notifications-text">
                No urgent notifications right now.
              </p>
            ) : (
              urgentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="notification-dropdown-item clickable-notification-item"
                  onClick={handleItemClick}
                >
                  <div className="notification-warning-dot" />
                  <div className="notification-item-content">
                    <p className="notification-item-title">
                      <strong>{doc.title}</strong> ({doc.vehicleName})
                    </p>
                    <p className="notification-item-subtitle">
                      {doc.daysLeft < 0
                        ? `Expired ${Math.abs(doc.daysLeft)} days ago`
                        : doc.daysLeft === 0
                          ? "Expiring today!"
                          : `Expiring in ${doc.daysLeft} ${doc.daysLeft === 1 ? "day" : "days"}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
