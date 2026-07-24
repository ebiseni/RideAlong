import { Routes, Route } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import AppShell from "./AppShell";
// import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/marketing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Onboarding from "../pages/onboarding/Onboarding";

import DashboardPage from "../pages/dashboard/DashboardPage";
import DocumentUploadPage from "../pages/documents/DocumentUploadPage";
import DocumentDetailPage from "../pages/documents/DocumentDetailPage";
import RemindersPage from "../pages/reminders/RemindersPage";
import VehicleListPage from "../pages/vehicles/VehicleListPage";
import VehicleFormPage from "../pages/vehicles/VehicleFormPage";
import VehicleDetailPage from "../pages/vehicles/VehicleDetailPage"; // 1. Import your vehicle details page
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/settings/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Protected routes, wrapped in AppShell (sidebar layout) */}
      <Route element={<PublicLayout />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentUploadPage />} />
          <Route
            path="/documents/:documentId"
            element={<DocumentDetailPage />}
          />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/vehicles" element={<VehicleListPage />} />
          <Route path="/vehicles/add" element={<VehicleFormPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />{" "}
          {/* 2. Add the dynamic detail route */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
