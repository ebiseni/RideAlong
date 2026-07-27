import "../../styles/components/documents/FileDropzone.css";

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
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onFileSelect(selectedFile);
  };

  return (
    <label
      className="file-dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <span className="file-dropzone-icon">⬆</span>
      <p className="file-dropzone-text">
        Drag and drop your files(s) or <span className="file-dropzone-browse-link">browse</span>
      </p>
      <p className="file-dropzone-hint">{maxSizeLabel}</p>
      <input
        type="file"
        accept={accept}
        className="file-dropzone-input"
        onChange={handleBrowse}
      />
    </label>
  );
}