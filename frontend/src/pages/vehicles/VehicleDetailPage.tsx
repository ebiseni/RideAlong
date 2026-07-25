import { useParams, useNavigate } from "react-router-dom";
import { useVehicles } from "../../hooks/useVehicles";
import "../../styles/pages/vehicles/VehicleDetailPage.css";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useVehicles();

  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return (
      <div className="vehicle-detail-page">
        <div className="detail-card">
          <h1>Vehicle not found</h1>
          <button className="btn-secondary" onClick={() => navigate("/vehicles")}>
            ← Back to Vehicles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="vehicle-detail-page">
      <button 
        onClick={() => navigate("/vehicles")} 
        className="back-link"
      >
        ← Back to Vehicles
      </button>

      {/* Header Card */}
      <div className="detail-header-card">
        <div className="detail-header-top">
          <div>
            <h1 className="detail-title">{vehicle.name}</h1>
            <p className="detail-plate">{vehicle.plate}</p>
          </div>
          <span className={`status-pill status-${vehicle.statusClass}`}>
            {vehicle.status}
          </span>
        </div>

        {vehicle.subText && (
          <p className="detail-subtext">{vehicle.subText}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="detail-stats-grid">
        <div className="stat-card">
          <p className="stat-label">Documents</p>
          <p className="stat-value">{vehicle.documents}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Compliance</p>
          <p className={`stat-value status-text-${vehicle.statusClass}`}>{vehicle.status}</p>
        </div>
      </div>

      {/* Documents Section */}
      <div className="detail-documents-card">
        <div className="documents-header">
          <h2>Vehicle Documents</h2>
          <button className="btn-primary">
            + Upload Document
          </button>
        </div>
        <div className="documents-empty">
          <p>No documents uploaded yet</p>
          <p className="documents-subtext">Upload insurance, registration, and other vehicle documents here</p>
        </div>
      </div>
    </div>
  );
}