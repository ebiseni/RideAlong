// src/pages/documents/DocumentDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import DocumentStatusBadge from "../../components/documents/DocumentStatusBadge";
import "../../styles/pages/documents/DocumentDetailPage.css";

export default function DocumentDetailPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { documents } = useDocuments();

  const document = documents.find((d) => String(d.id) === documentId);

  if (!document) {
    return (
      <div className="document-detail-container">
        <button className="document-detail-back-btn" onClick={() => navigate("/documents")}>
          ← My Documents
        </button>
        <p className="document-detail-not-found">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="document-detail-container">
      <div className="document-detail-header">
        <button className="document-detail-back-btn" onClick={() => navigate("/documents")}>
          ← My Documents
        </button>
        <button className="document-detail-menu-btn" aria-label="More options">
          ⋮
        </button>
      </div>

      <div className="document-detail-title-row">
        <h1 className="document-detail-name">{document.name}</h1>
        <DocumentStatusBadge status={document.status} />
      </div>

      <div className="document-detail-cards">
        {/* TEMP: no real uploaded image data exists yet — DocumentItem has no
            frontImageUrl/backImageUrl field, and nothing from
            DocumentUploadModal persists the uploaded file into useDocuments.
            These are placeholder slots until real upload + storage is wired. */}
        <div className="document-detail-card-placeholder">
          <p className="document-detail-card-placeholder-text">Front of document</p>
        </div>
        <div className="document-detail-card-placeholder">
          <p className="document-detail-card-placeholder-text">Back of document</p>
        </div>
      </div>
    </div>
  );
}