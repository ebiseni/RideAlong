import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { auth, db } from "../../api/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useVehicles } from "../../hooks/useVehicles";
import { useDocuments } from "../../hooks/useDocuments";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Save,
  X,
} from "lucide-react";
import "../../styles/pages/profile/PersonalInformationPage.css";
import TotalIcon from "../../assets/icons/icon-total-vehicles 24x24.svg";
import ValidIcon from "../../assets/icons/icon-valid-docs (2).svg";
import ExpiringIcon from "../../assets/icons/icon-expiring-soon.svg";
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

// Profile-specific summary card matching Figma (White bg, green border, asset icon paths)
interface ProfileSummaryCardProps {
  title: string;
  value: number | string;
  borderColor?: string;
  iconBgColor?: string;
  iconSrc: string;
  footer: string;
  onClick: () => void;
}

const ProfileSummaryCard = ({
  title,
  value,
  borderColor = "#16a34a",
  iconBgColor = "#dcfce7",
  iconSrc,
  footer,
  onClick,
}: ProfileSummaryCardProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px",
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        backgroundColor: "transparent",
        cursor: "pointer",
        flex: 1,
        minWidth: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Top Row: Icon + Title matching Figma */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: iconBgColor,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={iconSrc}
            alt={title}
            style={{ width: "18px", height: "18px", objectFit: "contain" }}
          />
        </div>
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

      {/* Middle: Big Value */}
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "28px",
          fontWeight: "700",
          color: "#1a202c",
        }}
      >
        {value}
      </p>

      {/* Bottom: Footer link text */}
      <span
        style={{
          fontSize: "12px",
          color: "#16a34a",
          fontWeight: 500,
          display: "block",
        }}
      >
        {footer}
      </span>
    </div>
  );
};

export default function PersonalInformationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Pull live data hooks
  const { totalVehicles } = useVehicles();
  const { validCount, expiringCount } = useDocuments();

  const [user, setUser] = useState({
    name: "",
    driverId: "RA-22498",
    email: "",
    phone: "+2348123456789",
    location: "Lagos, Nigeria",
    dateJoined: "",
    avatar: "",
  });

  const [tempValue, setTempValue] = useState("");

  // Fetch auth user, load persisted avatar from Firestore, and fetch/generate dynamic driver ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);

        let formattedDate = "Recently";
        if (firebaseUser.metadata.creationTime) {
          const creationDate = new Date(firebaseUser.metadata.creationTime);
          const day = creationDate.getDate();
          const suffix =
            ["st", "nd", "rd"][(day - 1) % 10 > 2 ? 2 : (day - 1) % 10] || "th";
          const month = creationDate.toLocaleString("default", {
            month: "long",
          });
          const year = creationDate.getFullYear();
          formattedDate = `${day}${suffix} ${month}, ${year}`;
        }

        let savedAvatar = firebaseUser.photoURL || "";
        let dynamicDriverId = "RA-22498";

        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.avatarUrl) savedAvatar = data.avatarUrl;
            if (data.driverId) dynamicDriverId = data.driverId;
          } else {
            dynamicDriverId = await getOrCreateDriverId(firebaseUser);
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
        }

        setUser((prev) => ({
          ...prev,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "User",
          driverId: dynamicDriverId,
          email: firebaseUser.email || "",
          avatar: savedAvatar,
          dateJoined: formattedDate,
        }));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (field: string, value: string) => {
    setIsEditing(field);
    setTempValue(value);
  };

  const handleSave = async (field: keyof typeof user) => {
    setUser((prev) => ({ ...prev, [field]: tempValue }));
    setIsEditing(null);

    if (field === "name" && currentUser) {
      try {
        await updateProfile(currentUser, { displayName: tempValue });
        localStorage.setItem("userName", tempValue);
      } catch (error) {
        console.error("Error updating display name:", error);
      }
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onload = async () => {
        const resultString = reader.result as string;
        setUser((prev) => ({ ...prev, avatar: resultString }));

        // Persist permanently to Firestore user document so it survives logouts and deployments
        try {
          const userRef = doc(db, "users", currentUser.uid);
          await setDoc(userRef, { avatarUrl: resultString }, { merge: true });
        } catch (error) {
          console.error("Error saving avatar to Firestore:", error);
        }

        // Optional local backup sync
        localStorage.setItem(`userAvatar_${currentUser.uid}`, resultString);
        localStorage.setItem("userAvatarUrl", resultString);
      };
      reader.readAsDataURL(file);
    }
  };

  const infoFields = [
    {
      key: "name" as const,
      label: "Full name",
      icon: <UserIcon size={16} />,
      editable: true,
    },
    {
      key: "email" as const,
      label: "Email Address",
      icon: <Mail size={16} />,
      editable: true,
    },
    {
      key: "phone" as const,
      label: "Phone Number",
      icon: <Phone size={16} />,
      editable: true,
    },
    {
      key: "location" as const,
      label: "Location",
      icon: <MapPin size={16} />,
      editable: true,
    },
    {
      key: "dateJoined" as const,
      label: "Date Joined",
      icon: <Calendar size={16} />,
      editable: false,
    },
  ];

  if (loading) {
    return (
      <div className="personal-info-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="personal-info-container">
      <div className="pi-header">
        <button className="pi-back" onClick={() => navigate("/profile")}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Profile</h1>
          <p>View and manage your personal information</p>
        </div>
      </div>

      <div className="pi-card">
        <div className="pi-avatar-section">
          <div className="pi-avatar-wrap">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="pi-avatar"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="pi-avatar-placeholder">
                <UserIcon size={48} />
              </div>
            )}
            <button
              className="pi-camera"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>
          <button
            className="pi-change-photo"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </button>
          <p className="pi-photo-hint">
            JPG, PNG or GIF
            <br />
            Max 10MB
          </p>
        </div>

        <div className="pi-details">
          <div className="pi-name-block">
            <h2>{user.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Driver ID: {user.driverId}</span>
              <div
                style={{
                  backgroundColor: "#dcfce7",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={SecurityCheckIcon}
                  alt="Verified"
                  style={{
                    width: "14px",
                    height: "14px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pi-info-list">
            {infoFields.map((field) => (
              <div key={field.key} className="pi-info-row">
                <div className="pi-info-left">
                  <div className="pi-info-icon">{field.icon}</div>
                  <div>
                    <p className="pi-label">{field.label}</p>
                    {isEditing === field.key ? (
                      <input
                        className="pi-edit-input"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <p className="pi-value">{user[field.key]}</p>
                    )}
                  </div>
                </div>

                {field.editable &&
                  (isEditing === field.key ? (
                    <div className="pi-edit-actions">
                      <button
                        className="pi-save"
                        onClick={() => handleSave(field.key)}
                      >
                        <Save size={14} />
                      </button>
                      <button
                        className="pi-cancel"
                        onClick={() => setIsEditing(null)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="pi-edit"
                      onClick={() =>
                        handleEdit(field.key, user[field.key] as string)
                      }
                    >
                      <Edit size={14} /> Edit
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pi-overview" style={{ marginTop: "24px" }}>
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a202c",
          }}
        >
          Account Overview
        </h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {/* Total Vehicles Card */}
          <ProfileSummaryCard
            title="Total Vehicles"
            value={totalVehicles}
            borderColor="#16a34a"
            iconBgColor="#dcfce7"
            iconSrc={TotalIcon}
            footer="View all vehicles"
            onClick={() => navigate("/vehicles")}
          />

          {/* Valid Documents Card */}
          <ProfileSummaryCard
            title="Valid Documents"
            value={validCount}
            borderColor="#16a34a"
            iconBgColor="#dcfce7"
            iconSrc={ValidIcon}
            footer="View Documents"
            onClick={() => navigate("/documents")}
          />

          {/* Expiring Soon Card */}
          <ProfileSummaryCard
            title="Expiring Soon"
            value={expiringCount}
            borderColor="#fef08a"
            iconBgColor="#fef9c3"
            iconSrc={ExpiringIcon}
            footer="View Reminders"
            onClick={() => navigate("/reminders")}
          />
        </div>
      </div>
    </div>
  );
}
