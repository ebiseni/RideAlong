
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv4eFxcWzn3DhahaquQnRQIh1Ad_Y33oY",
  authDomain: "ride-along-984ae.firebaseapp.com",
  projectId: "ride-along-984ae",
  storageBucket: "ride-along-984ae.firebasestorage.app",
  messagingSenderId: "488462966183",
  appId: "1:488462966183:web:1bbdf73cefb0758d1c2a82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);