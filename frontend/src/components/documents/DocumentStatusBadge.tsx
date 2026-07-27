import "../../styles/components/documents/DocumentStatusBadge.css";

interface DocumentStatusBadgeProps {
  status: "valid" | "expiring" | "expired";
}

const STATUS_LABELS: Record<DocumentStatusBadgeProps["status"], string> = {
  valid: "VALID",
  expiring: "EXPIRING SOON",
  expired: "EXPIRED",
};

export default function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return (
    <span className={`document-status-badge ${status}`}>
      STATUS: <strong>{STATUS_LABELS[status]}</strong>
    </span>
  );
}