import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../../api/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  MapPin,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  User as UserIcon,
} from "lucide-react";
import "../../styles/pages/profile/ProfilePage.css";
import SecurityCheckIcon from "../../assets/icons/security-check.svg";

// Helper to get or persistently generate a unique driver ID in Firestore
async function getOrCreateDriverId(user: {
  uid: string;
  email?: string | null;
}) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && userSnap.data().driverId) {
    return userSnap.data().driverId;
  } else {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newDriverId = `RA-${randomNum}`;

    await setDoc(
      userRef,
      {
        driverId: newDriverId,
        email: user.email,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return newDriverId;
  }
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [driverId, setDriverId] = useState("RA-22498");

  // Fetch the actual authenticated user from Firebase, load avatar, and fetch/generate dynamic driver ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const savedAvatar =
          localStorage.getItem(`userAvatar_${user.uid}`) ||
          localStorage.getItem("userAvatarUrl") ||
          user.photoURL ||
          null;
        setAvatarUrl(savedAvatar);

        try {
          const uniqueId = await getOrCreateDriverId(user);
          setDriverId(uniqueId);
        } catch (error) {
          console.error("Error fetching driver ID:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Use Firebase user data or fallback nicely
  const user = {
    name:
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "User",
    driverId: driverId,
    email: currentUser?.email || "",
    verified: true,
    avatar: avatarUrl,
  };

  // Only Personal Information is displayed here; security, reminders, and payment are unlinked/removed from view.
  const menuItems = [
    {
      id: "personal",
      icon: <MapPin size={18} className="text-green-600" />,
      title: "Personal Information",
      subtitle: "View and edit your personal details",
      onClick: () => navigate("/profile/personal"),
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="profile-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Profile</span>
        </button>
      </div>

      <div className="profile-user-card">
        <div className="profile-avatar-container">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <UserIcon size={48} />
            </div>
          )}
        </div>

        <div className="profile-user-info">
          <h2 className="profile-name">{loading ? "Loading..." : user.name}</h2>
          <div className="profile-driver-id">
            <span>Driver ID: {user.driverId}</span>
            {user.verified && (
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 4px #f0fdf4",
                  marginLeft: "4px",
                  verticalAlign: "middle",
                }}
              >
                <img
                  src={SecurityCheckIcon}
                  alt="Verified"
                  style={{
                    width: "16px",
                    height: "16px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </div>
          {user.verified && (
            <span className="verified-badge">
              <UserCheck size={14} /> Verified Driver
            </span>
          )}
        </div>
      </div>

      <div className="profile-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="profile-menu-item"
            onClick={item.onClick}
          >
            <div className="profile-menu-left">
              <div className="profile-menu-icon">{item.icon}</div>
              <div className="profile-menu-text">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>
            <ChevronRight size={18} className="profile-menu-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}
