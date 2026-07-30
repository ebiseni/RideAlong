import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../api/firebase";

export async function getOrCreateDriverId(user: {
  uid: string;
  email?: string | null;
}) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && userSnap.data().driverId) {
    // If the user already has a driver ID stored, return it
    return userSnap.data().driverId;
  } else {
    // Otherwise, generate a unique random ID (e.g., RA-XXXXX)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newDriverId = `RA-${randomNum}`;

    // Save it to Firestore so it persists permanently for this user UID
    await setDoc(
      userRef,
      {
        driverId: newDriverId,
        email: user.email,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return newDriverId;
  }
}
