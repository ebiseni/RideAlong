// src/components/shared/NotificationBell.tsx
import "../../styles/components/shared/NotificationBell.css";

interface NotificationBellProps {
  hasUnread?: boolean;
  onClick?: () => void;
}

export default function NotificationBell({
  hasUnread = false,
  onClick,
}: NotificationBellProps) {
  return (
    <div
      className="notification-bell-container"
      onClick={onClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {hasUnread && <span className="notification-indicator" />}
      <svg
        className="notification-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    </div>
  );
}
