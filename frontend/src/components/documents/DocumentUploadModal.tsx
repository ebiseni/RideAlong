import { useState, useEffect } from "react";
import FileDropzone from "./FileDropzone";
import "../../styles/components/documents/DocumentUploadModal.css";

interface DocumentUploadModalProps {
//   documentName: string;
  onClose: () => void;
  onComplete: () => void;
}

interface UploadedFile {
  name: string;
  sizeLabel: string;
}

export default function DocumentUploadModal({ onClose, onComplete }: DocumentUploadModalProps) {
  const [file, setFile] = useState<UploadedFile | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleFileSelect = (selectedFile: File) => {
    setFile({ name: selectedFile.name, sizeLabel: formatSize(selectedFile.size) });
  };

  return (
    <div className="document-upload-backdrop" onClick={onClose}>
      <div className="document-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="document-upload-header">
          <div>
            <h2 className="document-upload-title">Document Upload</h2>
            <p className="document-upload-subtitle">
              Add your documents here, and you can upload up to 5 files max.
            </p>
          </div>
          <button className="document-upload-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <FileDropzone onFileSelect={handleFileSelect} />

        <p className="document-upload-supported-note">Supported files .jpg, .png and PDF files</p>

        {file && (
          <div className="document-upload-file-row">
            <span className="document-upload-file-icon">🖼</span>
            <div className="document-upload-file-info">
              <p className="document-upload-file-name">{file.name}</p>
              <p className="document-upload-file-size">{file.sizeLabel}</p>
            </div>
            <span className="document-upload-file-status">✓</span>
            <button
              className="document-upload-file-delete"
              onClick={() => setFile(null)}
              aria-label="Remove file"
            >
              🗑
            </button>
          </div>
        )}

        <div className="document-upload-actions">
          <button className="document-upload-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="document-upload-next-btn" disabled={!file} onClick={onComplete}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}