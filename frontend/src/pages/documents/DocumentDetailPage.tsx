import { useParams, useNavigate, Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useVehicles } from "../../hooks/useVehicles"; // to show vehicle name
import DocumentStatusBadge from "../../components/documents/DocumentStatusBadge";
import "../../styles/pages/documents/DocumentDetailPage.css";

export default function DocumentDetailPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { documents, loading, deleteDocument } = useDocuments();
  const { vehicles } = useVehicles();

  const document = documents.find((d) => String(d.id) === documentId);
  const linkedVehicle = document?.vehicleId 
    ? vehicles.find(v => v.id === document.vehicleId) 
    : null;

  const handleDelete = async () => {
    if (!document) return;
    if (!confirm(`Delete ${document.name}?`)) return;
    
    try {
      await deleteDocument(document.id);
      navigate("/documents");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="document-detail-container">
        <p>Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="document-detail-container">
        <button
          className="document-detail-back-btn"
          onClick={() => navigate("/documents")}
        >
          ← My Documents
        </button>
        <p className="document-detail-not-found">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="document-detail-container">
      <div className="document-detail-header">
        <button
          className="document-detail-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <button 
          className="document-detail-delete-btn" 
          onClick={handleDelete}
          aria-label="Delete document"
        >
          Delete
        </button>
      </div>

      <div className="document-detail-title-row">
        <h1 className="document-detail-name">{document.name}</h1>
        <DocumentStatusBadge status={document.status} />
      </div>

      {/* Document Info */}
      <div className="document-detail-info">
        <div className="document-detail-info-row">
          <span>Expiry Date</span>
          <span>{document.expiryDate || "No expiry"}</span>
        </div>
        <div className="document-detail-info-row">
          <span>Document Number</span>
          <span>{document.documentNumber || "-"}</span>
        </div>
        <div className="document-detail-info-row">
          <span>Vehicle</span>
          <span>
            {linkedVehicle ? (
              <Link to={`/vehicles/${linkedVehicle.id}`}>{linkedVehicle.name}</Link>
            ) : "General"}
          </span>
        </div>
      </div>

      {/* FIX: Show Front + Back images side by side */}
      <div className="document-detail-images">
        <div className="document-detail-image-col">
          <p className="document-detail-image-label">Front of Document</p>
          <div className="document-detail-card-image-slot">
            {document.frontImageUrl ? (
              <img
                src={document.frontImageUrl}
                alt={`${document.name} — front`}
                className="document-detail-card-image"
              />
            ) : (
              <p className="document-detail-card-placeholder-text">
                No front image
              </p>
            )}
          </div>
        </div>

        <div className="document-detail-image-col">
          <p className="document-detail-image-label">Back of Document</p>
          <div className="document-detail-card-image-slot">
            {document.backImageUrl ? ( // NEW: render back
              <img
                src={document.backImageUrl}
                alt={`${document.name} — back`}
                className="document-detail-card-image"
              />
            ) : (
              <p className="document-detail-card-placeholder-text">
                No back image
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}