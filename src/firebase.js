import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBqp3fMWp6A-GDJxMZMVfNFDzDhoqNB4O4",
  authDomain: "test-72bd8.firebaseapp.com",
  databaseURL: "https://test-72bd8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-72bd8",
  storageBucket: "test-72bd8.firebasestorage.app",
  messagingSenderId: "1032488763034",
  appId: "1:1032488763034:web:2eb488e1ca090bfe386923",
  measurementId: "G-ERS35967B3",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);