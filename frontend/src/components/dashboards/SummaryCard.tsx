interface CardProps {
  title: string;
  value: number | string;
  color?: "default" | "green" | "yellow" | "red";
  icon?: string;
  footer?: string;
  layout?: "default" | "profile";
}

export const SummaryCard = ({
  title,
  value,
  color = "default",
  icon,
  footer,
  layout = "default",
}: CardProps) => {
  const getStyles = () => {
    switch (color) {
      case "green":
        return {
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
          border: "#bbf7d0",
          iconBg: "#dcfce7",
        };
    }
  };

  const styles = getStyles();

  // Profile layout matching Figma (Icon on left of title)
  if (layout === "profile") {
    return (
      <div
        style={{
          padding: "20px",
          borderRadius: "12px",
          border: `1px solid ${styles.border}`,
          backgroundColor: styles.bg || "#ffffff",
          color: "#1a202c",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
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
        </div>

        <p
          style={{
            margin: "0 0 12px 0",
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
              display: "block",
            }}
          >
            {footer}
          </span>
        )}
      </div>
    );
  }

  // Original Dashboard Layout (Untouched)
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        border: `1px solid ${styles.border}`,
        backgroundColor: styles.bg,
        color: "#1a202c",
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
