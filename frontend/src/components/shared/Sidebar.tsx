import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import sidebarLogo from "../../assets/logos/sidebar-logo.svg";
import dashboardIcon from "../../assets/icons/dashboard-icon.svg";
import documentIcon from "../../assets/icons/document-icon.svg";
import reminderIcon from "../../assets/icons/reminder-icon.svg";
import vehicleIcon from "../../assets/icons/vehicle-icon.svg";
import profileIcon from "../../assets/icons/profile-icon.svg";
import settingIcon from "../../assets/icons/setting-icon.svg";
import "../../styles/components/shared/Sidebar.css";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: dashboardIcon },
  { label: "Documents", path: "/documents", icon: documentIcon },
  { label: "Reminder", path: "/reminders", icon: reminderIcon },
  { label: "Vehicles", path: "/vehicles", icon: vehicleIcon },
  { label: "Profile", path: "/profile", icon: profileIcon },
  { label: "Settings", path: "/settings", icon: settingIcon },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);
  const user = useCurrentUser();

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
        <div className="sidebar-backdrop" onClick={closeMobileMenu} aria-hidden="true" />
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
              <img src={item.icon} alt="" aria-hidden="true" className="sidebar-icon" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-profile">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="sidebar-avatar" />
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