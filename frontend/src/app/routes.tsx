import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import AppShell from "./AppShell";

import LandingPage from "../pages/marketing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Onboarding from "../pages/onboarding/Onboarding";

import DashboardPage from "../pages/dashboard/DashboardPage";
import DocumentDetailPage from "../pages/documents/DocumentDetailPage";
import RemindersPage from "../pages/reminders/RemindersPage";
import VehicleListPage from "../pages/vehicles/VehicleListPage";
import VehicleDetailPage from "../pages/vehicles/VehicleDetailPage";
import ProfilePage from "../pages/profile/ProfilePage";
import PersonalInformationPage from "../pages/profile/PersonalInformationPage";
import ReminderPreferencesPage from "../pages/profile/ReminderPreferencesPage"; // ADD

// import PaymentMethodsPage from "../pages/profile/PaymentMethodsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import DocumentsListPage from "../pages/documents/DocumentsListPage";
import AddDocumentsPage from "../pages/documents/AddDocumentsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* 2. Protected routes with AppShell - Sidebar stays here */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsListPage />} />
        <Route path="/documents/add" element={<AddDocumentsPage />} />
        <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/vehicles" element={<VehicleListPage />} />
        <Route path="/vehicles/:id/documents" element={<VehicleDetailPage />} />
        {/* Profile Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/personal" element={<PersonalInformationPage />} />
        <Route
          path="/profile/reminders"
          element={<ReminderPreferencesPage />}
        />{" "}
        {/* NEW */}
        {/* <Route path="/profile/payment" element={<PaymentMethodsPage />} /> */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 3. Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
