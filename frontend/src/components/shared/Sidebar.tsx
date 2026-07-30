import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { auth } from "../../api/firebase";
import sidebarLogo from "../../assets/logos/sidebar-logo.svg";
import dashboardIcon from "../../assets/icons/dashboard-icon.svg";
import documentIcon from "../../assets/icons/document-icon.svg";
import reminderIcon from "../../assets/icons/reminder-icon.svg";
import vehicleIcon from "../../assets/icons/vehicle-icon.svg";
import profileIcon from "../../assets/icons/profile-icon.svg";
import settingIcon from "../../assets/icons/setting-icon.svg";
import "../../styles/components/shared/Sidebar.css";
import { useSettings } from "../../context/SettingsContext";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);
  const user = useCurrentUser();
  const { t } = useSettings();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const savedAvatar =
        localStorage.getItem(`userAvatar_${currentUser.uid}`) ||
        localStorage.getItem("userAvatarUrl") ||
        user.avatarUrl ||
        currentUser.photoURL ||
        null;
      setAvatarUrl(savedAvatar);
    } else {
      setAvatarUrl(user.avatarUrl || null);
    }
  }, [user]);

  const NAV_ITEMS = [
    { label: t("dashboard"), path: "/dashboard", icon: dashboardIcon },
    { label: t("documents"), path: "/documents", icon: documentIcon },
    { label: t("reminder"), path: "/reminders", icon: reminderIcon },
    { label: t("vehicles"), path: "/vehicles", icon: vehicleIcon },
    { label: t("profile"), path: "/profile", icon: profileIcon },
    { label: t("settings"), path: "/settings", icon: settingIcon },
  ];

  return (
    <>
      <div className="sidebar-mobile-bar">
        <img src={sidebarLogo} alt="RideAlong" className="sidebar-logo" />
        <button
          className="sidebar-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <img src={sidebarLogo} alt="RideAlong" className="sidebar-logo" />
          <button
            className="sidebar-close"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                className="sidebar-icon"
              />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-profile">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.name}
              className="sidebar-avatar"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="sidebar-avatar sidebar-avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="sidebar-profile-text">
            <p className="sidebar-profile-name">{user.name}</p>
            <p className="sidebar-profile-email">{user.email}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
