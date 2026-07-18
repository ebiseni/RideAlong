import { Navigate, Outlet } from "react-router-dom";
// TODO: replace with real auth check once AuthContext/useAuth is implemented
const isAuthenticated = () => {
  return Boolean(localStorage.getItem("accessToken")); // placeholder check
};

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}