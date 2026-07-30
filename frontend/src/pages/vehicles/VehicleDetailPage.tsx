import { useParams, useNavigate } from "react-router-dom";
import { useVehicles } from "../../hooks/useVehicles";
import { useDocuments } from "../../hooks/useDocuments";
import "../../styles/pages/vehicles/VehicleDetailPage.css";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const { documents } = useDocuments();

  const vehicle = vehicles.find((v) => v.id === id);
  const vehicleDocuments = documents.filter((d) => d.vehicleId === id);

  const hasDocuments = vehicleDocuments.length > 0;
  const statusText = hasDocuments ? "Compliant" : "No documents";
  const statusClass = hasDocuments ? "active" : "no-documents";
  
  if (!vehicle) return <p>Vehicle not found</p>;
    return (
      <div className="vehicle-detail-page">
      {/* Header Card */}
      <div className="detail-header-card">
        <div className="detail-header-top">
          <div>
            <h1 className="detail-title">{vehicle.name}</h1>
            <p className="detail-plate">{vehicle.plate}</p>
          </div>
          <span className={`status-pill status-${statusClass}`}>
            {statusText}
          </span>
        </div>

        {vehicle.subText && <p className="detail-subtext">{vehicle.subText}</p>}
      </div>

      {/* Stats Grid */}
      <div className="detail-stats-grid">
        <div className="stat-card">
          <p className="stat-label">Documents</p>
          {/* UPDATED: was vehicle.documents (static mock number), now the
              real count of documents linked to this vehicle via vehicleId */}
          <p className="stat-value">{vehicleDocuments.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Compliance</p>
          <p className={`stat-value status-text-${statusClass}`}>
            {statusText}
          </p>
        </div>
      </div>

      {/* Documents Section */}
      <div className="detail-documents-card">
        <div className="documents-header">
          <h2>Vehicle Documents</h2>
          <button
            className="btn-primary"
            onClick={() => navigate(`/documents/add?vehicleId=${vehicle.id}`)}
          >
            + Upload Document
          </button>
        </div>

        {vehicleDocuments.length === 0 ? (
          <div className="documents-empty">
            <p>No documents uploaded yet</p>
            <p className="documents-subtext">
              Upload insurance, registration, and other vehicle documents here
            </p>
          </div>
        ) : (
          <div className="documents-list">
            {vehicleDocuments.map((doc) => (
              <button
                key={doc.id}
                className="documents-list-item"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <span className="documents-list-item-name">{doc.name}</span>
                <span className={`documents-list-item-status status-${doc.status}`}>
                  {doc.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
    );
  }

