import { useRef } from "react";
import "../../styles/components/documents/FileDropzone.css";

import uploadFileIcon from "../../assets/icons/document-upload-icon.svg";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeLabel?: string;
}

export default function FileDropzone({
  onFileSelect,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSizeLabel = "Max 25 MB files are allowed",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onFileSelect(selectedFile);
    e.target.value = "";
  };

  return (
    <div
      className="file-dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <img src={uploadFileIcon} alt="" className="file-dropzone-icon" />
      <p className="file-dropzone-text">
        Drag and drop your files(s) or <span className="file-dropzone-browse-link">browse</span>
      </p>
      <p className="file-dropzone-hint">{maxSizeLabel}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="file-dropzone-input"
        onChange={handleChange}
      />
    </div>
  );
}