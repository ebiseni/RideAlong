import { NavLink } from "react-router-dom";
import sidebarLogo from "../../assets/logos/sidebar-logo.svg";
import dashboardIcon from "../../assets/icons/dashboard-icon.svg";
import documentIcon from "../../assets/icons/document-icon.svg";
import reminderIcon from "../../assets/icons/reminder-icon.svg";
import vehicleIcon from "../../assets/icons/vehicle-icon.svg";
import profileIcon from "../../assets/icons/profile-icon.svg";
import settingIcon from "../../assets/icons/setting-icon.svg";
import logoutIcon from "../../assets/icons/logout-iocn.svg";
import "../../styles/components/shared/Sidebar.css";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: dashboardIcon },
  { label: "Documents", path: "/documents", icon: documentIcon },
  { label: "Reminder", path: "/reminders", icon: reminderIcon },
  { label: "Vehicles", path: "/vehicles", icon: vehicleIcon },
  { label: "Profile", path: "/profile", icon: profileIcon },
  { label: "Settings", path: "/settings", icon: settingIcon },
];

interface SidebarProps {
  onLogoutClick: () => void;
}

export default function Sidebar({ onLogoutClick }: SidebarProps) {
  return (
    <aside className="sidebar">
      <img src={sidebarLogo} alt="RideAlong" className="sidebar-logo" />

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <img src={item.icon} alt="" aria-hidden="true" className="sidebar-icon" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={onLogoutClick}>
        <img src={logoutIcon} alt="" aria-hidden="true" className="sidebar-icon" />
        Logout
      </button>
    </aside>
  );
}