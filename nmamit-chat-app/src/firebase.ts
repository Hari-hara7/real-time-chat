import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQ7josmI3ilpgN_DIAqi9l6EyTfclx1lw",
    authDomain: "academic-pal-db410.firebaseapp.com",
    projectId: "academic-pal-db410",
    storageBucket: "academic-pal-db410.firebasestorage.app",
    messagingSenderId: "3725523430",
    appId: "1:3725523430:web:916899f11d2a61b9e4be27",
    measurementId: "G-LDF7KSF52L"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
