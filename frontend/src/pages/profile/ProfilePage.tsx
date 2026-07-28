import { useNavigate } from "react-router-dom";
import { MapPin, Key, AlarmClock, CreditCard, ChevronRight, ArrowLeft, BadgeCheck, UserCheck } from "lucide-react"; // both
import "../../styles/pages/profile/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = {
    name: "Precious Aree",
    driverId: "RA-22498",
    email: "preciousaree8@gmail.com",
    verified: true,
    avatar: "https://i.pravatar.cc/150?img=47"
  };

  const menuItems = [
    {
      id: "personal",
      icon: <MapPin size={18} className="text-green-600" />,
      title: "Personal Information",
      subtitle: "View and edit your personal details",
      onClick: () => navigate("/profile/personal")
    },
    {
      id: "security",
      icon: <Key size={18} className="text-green-600" />,
      title: "Security",
      subtitle: "Password & Biometric settings",
      onClick: () => navigate("/profile/security")
    },
    {
      id: "reminders",
      icon: <AlarmClock size={18} className="text-green-600" />,
      title: "Reminder Preferences",
      subtitle: "Manage your notification Preferences",
      onClick: () => navigate("/profile/reminders")
    },
    {
      id: "payment",
      icon: <CreditCard size={18} className="text-green-600" />,
      title: "Payment Methods",
      subtitle: "Manage your payment methods",
      onClick: () => navigate("/profile/payment")
    }
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
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <div className="profile-user-info">
          <h2 className="profile-name">{user.name}</h2>
          <div className="profile-driver-id">
            <span>Driver ID: {user.driverId}</span>
            {user.verified && <BadgeCheck size={16} className="verified-icon text-blue-500" />} {/* Badge next to ID */}
          </div>
          {user.verified && (
            <span className="verified-badge">
              <UserCheck size={14} /> Verified Driver {/* Person with check in badge */}
            </span>
          )}
        </div>
      </div>

      <div className="profile-menu">
        {menuItems.map(item => (
          <button key={item.id} className="profile-menu-item" onClick={item.onClick}>
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