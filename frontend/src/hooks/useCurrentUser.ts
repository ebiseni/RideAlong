import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

export interface CurrentUser {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>({
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "",
    avatarUrl: localStorage.getItem("userAvatarUrl") || null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const storedAvatar =
          localStorage.getItem(`userAvatar_${firebaseUser.uid}`) ||
          firebaseUser.photoURL ||
          null;
        setUser({
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "User",
          email: firebaseUser.email || "",
          avatarUrl: storedAvatar,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
}
