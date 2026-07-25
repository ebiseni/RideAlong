export interface CurrentUser {
  name: string;
  email: string;
  avatarUrl: string | null;
}

// TEMP: reads from localStorage until AuthContext/useAuth is wired in and
// the login/get-current-user response shape is confirmed against the backend.
// Once that happens, swap the body of this hook to pull from AuthContext
// instead — the return shape (CurrentUser) should stay the same so nothing
// downstream (Sidebar, UserAvatarButton) needs to change.
export function useCurrentUser(): CurrentUser {
  const name = localStorage.getItem("userName") || "User";
  const email = localStorage.getItem("userEmail") || "";
  const avatarUrl = localStorage.getItem("userAvatarUrl") || null;

  return { name, email, avatarUrl };
}