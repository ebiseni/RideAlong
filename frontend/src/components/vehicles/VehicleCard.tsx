// src/components/vehicles/VehicleCard.tsx
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import "../../styles/components/vehicles/VehicleCard.css";
import { type VehicleDocument } from "../../hooks/useVehicles";

type VehicleCardProps = {
  id: string;
  name: string;
  plate: string;
  documents: number | VehicleDocument[];
  status: string;
  statusClass: "green" | "yellow" | "red";
  subText?: string;
  vehicleDocuments?: VehicleDocument[];
  onDelete?: (id: string) => void;
};

export const VehicleCard = ({
  id,
  name,
  plate,
  documents,
  status,
  statusClass,
  subText,
  onDelete,
}: VehicleCardProps) => {
  const docCount = Array.isArray(documents) ? documents.length : documents;

  return (
    <Link
      to={`/vehicles/${id}/documents`}
      className="vehicle-card-link-wrapper"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div className="vehicle-card">
        <div className="vehicle-left">
          <div className="vehicle-avatar">{name ? name.charAt(0) : "V"}</div>
          <div className="vehicle-info">
            <h3 className="vehicle-name">{name}</h3>
            <p className="vehicle-plate">{plate}</p>
            <p className="vehicle-documents">
              {docCount} Document{docCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="vehicle-right">
          <div className="compliance-wrapper">
            <span className={`compliance-badge ${statusClass}`}>
              {statusClass === "green" ? (
                <svg
                  className="badge-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ) : statusClass === "yellow" ? (
                <svg
                  className="badge-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              ) : (
                <svg
                  className="badge-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              )}
              {status}
            </span>
            {subText && <span className="compliance-subtext">{subText}</span>}
          </div>

          {onDelete && (
            <button
              className="btn-delete-card"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm(`Delete ${name}? This cannot be undone.`)) {
                  onDelete(id);
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          )}

          <span className="vehicle-arrow">&gt;</span>
        </div>
      </div>
    </Link>
  );
};
