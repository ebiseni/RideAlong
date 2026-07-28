import { useState } from "react";
import FileDropzone from "./FileDropzone";
import "../../styles/components/documents/DocumentUploadModal.css";

import verifiedIcon from "../../assets/icons/documet-verified-icon.svg";
import deleteIcon from "../../assets/icons/document-delete-icon.svg";

interface DocumentUploadModalProps {
  onClose: () => void;
  onComplete: (expiryDate: string, file: File) => void;
}

export default function DocumentUploadModal({
  onClose,
  onComplete,
}: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState("");

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const canProceed = Boolean(file) && Boolean(expiryDate);

  return (
    <div className="document-upload-backdrop" onClick={onClose}>
      <div
        className="document-upload-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="document-upload-header">
          <div>
            <h2 className="document-upload-title">Document Upload</h2>
            <p className="document-upload-subtitle">
              Add your documents here, and you can upload up to 5 files max.
            </p>
          </div>
          <button
            className="document-upload-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <FileDropzone onFileSelect={setFile} />

        <p className="document-upload-supported-note">
          Supported files .jpg, .png and PDF files
        </p>

        {file && (
          <div className="document-upload-file-row">
            <span className="document-upload-file-icon">🖼</span>
            <div className="document-upload-file-info">
              <p className="document-upload-file-name">{file.name}</p>
              <p className="document-upload-file-size">
                {formatSize(file.size)}
              </p>
            </div>
            <img
              src={verifiedIcon}
              alt="Verified"
              className="document-upload-file-status"
            />
            <button
              className="document-upload-file-delete"
              onClick={() => setFile(null)}
              aria-label="Remove file"
            >
              <img src={deleteIcon} alt="" />
            </button>
          </div>
        )}

        <div className="document-upload-expiry-field">
          <label htmlFor="document-expiry-date">Expiry Date</label>
          <input
            id="document-expiry-date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="document-upload-actions">
          <button className="document-upload-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="document-upload-next-btn"
            disabled={!canProceed}
            onClick={() => file && onComplete(expiryDate, file)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}