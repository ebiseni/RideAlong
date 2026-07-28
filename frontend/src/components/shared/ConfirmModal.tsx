import { useEffect } from "react";
import "../../styles/components/shared/ConfirmModal.css";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string; // if omitted, only the confirm button renders (single-action/acknowledgment use case)
  onConfirm: () => void;
  onClose: () => void;
  variant?: "default" | "danger"; // "danger" tints the confirm button red, for destructive actions
}

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText,
  onConfirm,
  onClose,
  variant = "default",
}: ConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="confirm-modal-backdrop" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          {cancelText && (
            <button className="confirm-modal-cancel-btn" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button
            className={`confirm-modal-confirm-btn ${variant === "danger" ? "danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}