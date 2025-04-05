// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAigPvMs_F1Ye8RDEpJYXeoU4Wygm6N6EQ",
  authDomain: "minimal-todo-637a2.firebaseapp.com",
  projectId: "minimal-todo-637a2",
  storageBucket: "minimal-todo-637a2.firebasestorage.app",
  messagingSenderId: "548960895885",
  appId: "1:548960895885:web:a36b7e16bc0929e95833c4",
  measurementId: "G-GN1RKEJL7Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
