// src/components/vehicles/VehicleCard.tsx
import "../../styles/components/vehicles/VehicleCard.css";

export const VehicleCard = ({
  name,
  plate,
  documents,
  status,
  statusClass,
  subText,
}: any) => (
  <div className="vehicle-card">
    <div className="vehicle-left">
      <div className="vehicle-avatar">{name.charAt(0)}</div>
      <div className="vehicle-info">
        <h3 className="vehicle-name">{name}</h3>
        <p className="vehicle-plate">{plate}</p>
        <p className="vehicle-documents">{documents} Documents</p>
      </div>
    </div>

    <div className="vehicle-right">
      <div className="compliance-wrapper">
        <span className={`compliance-badge ${statusClass}`}>
          {statusClass === "green" ? (
            <svg
              className="badge-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          ) : (
            <svg
              className="badge-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          )}
          {status}
        </span>
        {subText && <span className="compliance-subtext">{subText}</span>}
      </div>
      <span className="vehicle-arrow">&gt;</span>
    </div>
  </div>
);
