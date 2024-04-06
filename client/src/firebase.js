// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "authentication-90784.firebaseapp.com",
    projectId: "authentication-90784",
    storageBucket: "authentication-90784.appspot.com",
    messagingSenderId: "850804426371",
    appId: "1:850804426371:web:0147fe057197831d653db6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);