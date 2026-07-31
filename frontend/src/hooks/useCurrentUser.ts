import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";

export interface CurrentUser {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>({
    name: "User",
    email: "",
    avatarUrl: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let avatar = firebaseUser.photoURL || null;
        let name =
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "User";

        // Fetch permanent user details from Firestore so it never relies solely on local storage
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.avatarUrl) avatar = data.avatarUrl;
            if (data.name || data.fullName) name = data.name || data.fullName;
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
        }

        setUser({
          name,
          email: firebaseUser.email || "",
          avatarUrl: avatar,
        });
      } else {
        setUser({
          name: "User",
          email: "",
          avatarUrl: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
}
