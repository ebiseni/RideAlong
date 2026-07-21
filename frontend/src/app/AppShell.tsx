import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import "../styles/components/layout/AppShell.css";

export default function AppShell() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth state via AuthContext once implemented
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Sidebar onLogoutClick={handleLogout} />
      <main className="app-shell-content">
        <Outlet />
      </main>
    </div>
  );
}