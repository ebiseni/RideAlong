import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import sidebarProfileImage from "../assets/images/sidebar-profile-image.jpg";
import "../styles/components/layout/AppShell.css";

export default function AppShell() {
  return (
    <div className="app-shell">
      {/* TEMP: hardcoded placeholder values until AuthContext/useAuth is implemented */}
       <Sidebar
        userName="Precious Aree"
        userEmail="preciousaree56@gmail.com"
        userAvatarUrl={sidebarProfileImage}
      />
      <main className="app-shell-content">
        <Outlet />
      </main>
    </div>
  );
}