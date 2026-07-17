import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Onboarding from "../pages/onboarding/Onboarding";
import LandingPage from "../pages/marketing/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}
