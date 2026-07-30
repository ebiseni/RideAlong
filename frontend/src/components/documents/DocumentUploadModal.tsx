import { useState, useEffect } from "react";
import FileDropzone from "./FileDropzone";
import "../../styles/components/documents/DocumentUploadModal.css";

import verifiedIcon from "../../assets/icons/documet-verified-icon.svg";
import deleteIcon from "../../assets/icons/document-delete-icon.svg";

interface DocumentUploadModalProps {
  onClose: () => void;
  // added backFile as 4th param
  onComplete: (expiryDate: string, file: File, backFile: File | null, documentNumber: string) => void;
}

// Reusable preview component
function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="document-upload-file-row">
      <span className="document-upload-file-icon">
        {preview? <img src={preview} alt="" className="document-upload-thumb" /> : "📄"}
      </span>
      <div className="document-upload-file-info">
        <p className="document-upload-file-name">{file.name}</p>
        <p className="document-upload-file-size">{formatSize(file.size)}</p>
      </div>
      <img src={verifiedIcon} alt="Verified" className="document-upload-file-status" />
      <button
        className="document-upload-file-delete"
        onClick={onRemove}
        aria-label="Remove file"
        type="button"
      >
        <img src={deleteIcon} alt="" />
      </button>
    </div>
  );
}

export default function DocumentUploadModal({ onClose, onComplete }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null); // front
  const [backFile, setBackFile] = useState<File | null>(null); // back
  const [expiryDate, setExpiryDate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");

  const canProceed = Boolean(file) && Boolean(expiryDate);

  return (
    <div className="document-upload-backdrop" onClick={onClose}>
      <div className="document-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="document-upload-header">
          <div>
            <h2 className="document-upload-title">Document Upload</h2>
            <p className="document-upload-subtitle">
              Upload front and back. Max 400KB per image on free plan.
            </p>
          </div>
          <button className="document-upload-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <label className="document-upload-label">Front of Document *</label>
        <FileDropzone onFileSelect={setFile} />
        {file && <FilePreview file={file} onRemove={() => setFile(null)} />}

        <label className="document-upload-label">Back of Document</label>
        <FileDropzone onFileSelect={setBackFile} />
        {backFile && <FilePreview file={backFile} onRemove={() => setBackFile(null)} />}

        <p className="document-upload-supported-note">
          Supported:.jpg,.png,.pdf. Keep each file under 400KB
        </p>

        <div className="document-upload-expiry-field">
          <label htmlFor="document-number">Document Number</label>
          <input
            id="document-number"
            type="text"
            placeholder="e.g. BU-485-7299"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </div>

        <div className="document-upload-expiry-field">
          <label htmlFor="document-expiry-date">Expiry Date *</label>
          <input
            id="document-expiry-date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="document-upload-actions">
          <button className="document-upload-cancel-btn" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="document-upload-next-btn"
            disabled={!canProceed}
            onClick={() => file && onComplete(expiryDate, file, backFile, documentNumber.trim())}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}