// src/components/dashboards/SummaryCard.tsx
interface CardProps {
  title: string;
  value: number | string;
  color?: "default" | "green" | "yellow" | "red";
  icon?: string;
  footer?: string;
}

export const SummaryCard = ({
  title,
  value,
  color = "default",
  icon,
  footer,
}: CardProps) => {
  const getStyles = () => {
    switch (color) {
      case "green":
        return {
          // bg: "#f0fdf4",
          border: "#bbf7d0",
          iconBg: "#dcfce7",
        };
      case "yellow":
        return {
          bg: "#fefce8",
          border: "#fef08a",
          iconBg: "#fef9c3",
        };
      case "red":
        return {
          bg: "#fef2f2",
          border: "#fecaca",
          iconBg: "#fee2e2",
        };
      default:
        return {
          // bg: "#ffffff",
          border: "#bbf7d0",
          iconBg: "#dcfce7",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        border: `1px solid ${styles.border}`,
        backgroundColor: styles.bg,
        color: "#1a202c", // Keeps text color clean and consistent like Figma
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 500,
            color: "#1a202c",
          }}
        >
          {title}
        </h3>
        {icon && (
          <div
            style={{
              backgroundColor: styles.iconBg,
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={icon}
              alt={title}
              style={{ width: "18px", height: "18px" }}
            />
          </div>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: "700",
          color: "#1a202c",
        }}
      >
        {value}
      </p>
      {footer && (
        <span
          style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "6px",
            display: "block",
          }}
        >
          {footer}
        </span>
      )}
    </div>
  );
};
