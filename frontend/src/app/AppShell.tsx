import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import "../styles/components/layout/AppShell.css";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-shell-content">
        <Outlet />
      </main>
    </div>
  );
}