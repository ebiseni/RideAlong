import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function UserAvatarButton() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const getInitials = (name: string) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <div
      onClick={() => navigate("/profile")}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      title="Go to profile"
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #cbd5e0",
          }}
        />
      ) : (
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#e6fffa",
            color: "#319795",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "16px",
            border: "1px solid #b2f5ea",
          }}
        >
          {getInitials(user.name)}
        </div>
      )}
    </div>
  );
}