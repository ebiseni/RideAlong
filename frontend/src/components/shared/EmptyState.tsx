// src/components/shared/EmptyState.tsx
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div
      className="empty-state-container"
      style={{ textAlign: "center", padding: "40px 20px" }}
    >
      {icon && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "#1a202c",
          marginBottom: "6px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "#718096",
          maxWidth: "280px",
          margin: "0 auto 20px auto",
        }}
      >
        {description}
      </p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          onClick={onActionClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#0a5c36",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          <span>+</span> {actionText}
        </Link>
      )}
    </div>
  );
}
