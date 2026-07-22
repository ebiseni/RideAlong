import { useAuthContext } from "../stores/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};