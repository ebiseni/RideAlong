import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentUploadModal from "../../components/documents/DocumentUploadModal";
import { useDocuments } from "../../hooks/useDocuments";
import "../../styles/pages/documents/AddDocumentsPage.css";

import documentIcon from "../../assets/icons/document-icon.svg";

const DOCUMENT_TYPES = [
  { id: "drivers-license", name: "Driver's Licence" },
  { id: "insurance", name: "Insurance Certificate/Papers" },
  { id: "vehicle-registration", name: "Vehicle Registration" },
  { id: "road-worthiness", name: "Road Worthiness" },
];

export default function AddDocumentsPage() {
  const navigate = useNavigate();
  const { addDocument } = useDocuments();
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  // TEMP: tracks which items have been uploaded in this session only.
  // Not persisted — swap for real document state once the backend upload
  // endpoint and DocumentItem schema are confirmed.
  const [uploadedIds, setUploadedIds] = useState<string[]>([]);

   const handleUploadComplete = (docId: string) => {
    const docType = DOCUMENT_TYPES.find((d) => d.id === docId);
    if (docType) {
      addDocument(docType.name); // TEMP: no expiry date captured yet, see useDocuments.addDocument
    }
    setUploadedIds((prev) => [...prev, docId]);
    setUploadingDocId(null);
  };

return (
    <div className="add-documents-container">
      <button className="add-documents-back-btn" onClick={() => navigate("/documents")}>
        ← Add your Documents
      </button>
      <p className="add-documents-subtitle">Select and upload your vehicle documents.</p>

      <div className="add-documents-list">
        {DOCUMENT_TYPES.map((doc) => {
          const isUploaded = uploadedIds.includes(doc.id);
          return (
            <button
              key={doc.id}
              className="add-documents-item"
              onClick={() => setUploadingDocId(doc.id)}
            >
              <div className="add-documents-item-icon-wrapper">
                <img src={documentIcon} alt="" className="add-documents-item-icon" />
              </div>
              <div className="add-documents-item-text">
                <p className="add-documents-item-name">{doc.name}</p>
                <p className="add-documents-item-hint">Upload file (PDF, JPG, PNG)</p>
              </div>
              <span className={`add-documents-item-check ${isUploaded ? "checked" : ""}`}>
                {isUploaded ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <p className="add-documents-footer-note">
        <span className="add-documents-footer-icon">ⓘ</span>
        Ensure the documents are in the right format before saving.
      </p>

      {uploadingDocId && (
        <DocumentUploadModal
        //   documentName={DOCUMENT_TYPES.find((d) => d.id === uploadingDocId)?.name ?? ""}
          onClose={() => setUploadingDocId(null)}
          onComplete={() => handleUploadComplete(uploadingDocId)}
        />
      )}
    </div>
  );
}