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

  if (!vehicle) {
    return (
      <div className="vehicle-detail-page">
        <div className="detail-card">
          <h1>Vehicle not found</h1>
          <button
            className="btn-secondary"
            onClick={() => navigate("/vehicles")}
          >
            ← Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const docCount = vehicleDocuments.length;

  const getDocumentStatusLabel = (count: number) => {
    if (count === 0) return "No documents";
    if (count === 1) return "1 document";
    return `${count} documents`;
  };

  const getComplianceStatus = (count: number) => {
    if (count === 0) return { text: "No documents", class: "no-docs" };

    // Case-insensitive check to catch "Expired", "expired", etc.
    const hasExpired = vehicleDocuments.some(
      (d: any) => String(d.status).toLowerCase() === "expired",
    );
    if (hasExpired) return { text: "Invalid", class: "expired" };

    const hasExpiring = vehicleDocuments.some(
      (d: any) => String(d.status).toLowerCase() === "expiring",
    );
    if (hasExpiring) return { text: "Valid", class: "valid" };

    return { text: "Valid", class: "valid" };
  };

  const compliance = getComplianceStatus(docCount);

  return (
    <div className="vehicle-detail-page">
      <button onClick={() => navigate("/vehicles")} className="back-link">
        ← Back to Vehicles
      </button>

      {/* Header Card */}
      <div className="detail-header-card">
        <div className="detail-header-top">
          <div>
            <h1 className="detail-title">{vehicle.name}</h1>
            <p className="detail-plate">{vehicle.plate}</p>
          </div>
          <span className={`status-pill status-${compliance.class}`}>
            {compliance.text}
          </span>
        </div>

        <p className="detail-subtext">
          {docCount === 0
            ? "Add documents to track expiry"
            : `${getDocumentStatusLabel(docCount)} uploaded`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="detail-stats-grid">
        <div className="stat-card">
          <p className="stat-label">Documents</p>
          <p className="stat-value">{docCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Compliance</p>
          <p className={`stat-value status-text-${compliance.class}`}>
            {compliance.text}
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

        {docCount === 0 ? (
          <div className="documents-empty">
            <p>No documents uploaded yet</p>
            <p className="documents-subtext">
              Upload insurance, registration, and other vehicle documents here
            </p>
          </div>
        ) : (
          <div className="documents-list">
            {vehicleDocuments.map((doc: any) => (
              <button
                key={doc.id}
                className="documents-list-item"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <span className="documents-list-item-name">{doc.name}</span>
                <span
                  className={`documents-list-item-status status-${doc.status}`}
                >
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
