import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DocumentUploadModal from "../../components/documents/DocumentUploadModal";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { useDocuments } from "../../hooks/useDocuments";
import { useVehicles } from "../../hooks/useVehicles";
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
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId") ?? undefined;

  const { addDocument, loading, uploading, documents } = useDocuments();
  const { vehicles } = useVehicles();
  const linkedVehicle = vehicleId
    ? vehicles.find((v) => v.id === vehicleId)
    : null;

  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Enforce that a vehicle must exist or be selected
  useEffect(() => {
    if (vehicles && vehicles.length === 0 && !vehicleId) {
      alert("Please register a vehicle before adding documents.");
      navigate("/vehicles");
    }
  }, [vehicles, vehicleId, navigate]);

  // Derive uploaded doc names from Firestore
  const uploadedNames = useMemo(() => {
    return documents
      .filter((d) => !vehicleId || d.vehicleId === vehicleId)
      .map((d) => d.name);
  }, [documents, vehicleId]);

  const handleUploadComplete = async (
    docId: string,
    expiryDate: string,
    file: File,
    backFile: File | null,
    documentNumber: string,
  ) => {
    const docType = DOCUMENT_TYPES.find((d) => d.id === docId);
    if (!docType) return;

    if (uploadedNames.includes(docType.name)) {
      alert("This document is already uploaded. Delete it first to re-upload.");
      setUploadingDocId(null);
      return;
    }

    try {
      await addDocument({
        name: docType.name,
        expiryDate,
        vehicleId:
          vehicleId || (vehicles.length > 0 ? vehicles[0].id : undefined),
        file,
        backFile,
        documentNumber,
      });
      setUploadingDocId(null);

      const newUploadedCount = uploadedNames.length + 1;
      if (newUploadedCount >= DOCUMENT_TYPES.length) {
        setShowCompleteModal(true);
      }
    } catch (err: unknown) {
      console.error("Failed to add document:", err);
      alert(err instanceof Error ? err.message : "Failed to upload document");
    }
  };

  const handleBack = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/documents`);
    } else {
      navigate("/documents");
    }
  };

  return (
    <div className="add-documents-container">
      <button className="add-documents-back-btn" onClick={handleBack}>
        ← Add your Documents
      </button>
      <p className="add-documents-subtitle">
        {linkedVehicle
          ? `Select and upload documents for ${linkedVehicle.name}.`
          : "Select and upload your vehicle documents."}
      </p>

      <div className="add-documents-list">
        {DOCUMENT_TYPES.map((doc) => {
          const isUploaded = uploadedNames.includes(doc.name);
          return (
            <button
              key={doc.id}
              className="add-documents-item"
              onClick={() => setUploadingDocId(doc.id)}
              disabled={loading || uploading || isUploaded}
            >
              <div className="add-documents-item-icon-wrapper">
                <img
                  src={documentIcon}
                  alt=""
                  className="add-documents-item-icon"
                />
              </div>
              <div className="add-documents-item-text">
                <p className="add-documents-item-name">{doc.name}</p>
                <p className="add-documents-item-hint">
                  {isUploaded ? "Uploaded ✓" : "Upload file (PDF, JPG, PNG)"}
                </p>
              </div>
              <span
                className={`add-documents-item-check ${isUploaded ? "checked" : ""}`}
              >
                {isUploaded ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <p className="add-documents-footer-note">
        <span className="add-documents-footer-icon">ⓘ</span>
        Ensure the documents are in the right format before saving. Max 400KB
        per image.
      </p>

      {uploadingDocId && (
        <DocumentUploadModal
          onClose={() => setUploadingDocId(null)}
          onComplete={(expiryDate, file, backFile, documentNumber) =>
            handleUploadComplete(
              uploadingDocId,
              expiryDate,
              file,
              backFile,
              documentNumber,
            )
          }
        />
      )}

      {showCompleteModal && (
        <ConfirmModal
          title="All Documents Uploaded"
          message="You've successfully uploaded all your vehicle documents."
          confirmText="Go to My Documents"
          onConfirm={() => navigate("/documents")}
          onClose={() => setShowCompleteModal(false)}
        />
      )}
    </div>
  );
}
