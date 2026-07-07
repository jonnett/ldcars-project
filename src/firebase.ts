import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ponemos los datos directamente aquí, sin process.env
const firebaseConfig = {
  apiKey: "AIzaSyCmGmoq9e25TelXfyiPE7XFba7ooBUb78U",
  authDomain: "ldcars-intranet.firebaseapp.com",
  projectId: "ldcars-intranet",
  storageBucket: "ldcars-intranet.firebasestorage.app",
  messagingSenderId: "983923587440",
  appId: "1:983923587440:web:f4cb6a6255946b035637b5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);