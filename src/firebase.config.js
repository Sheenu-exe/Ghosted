// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9C1xB12PYok_NhFtYUYCSOFA789ZiwTY",
  authDomain: "ghosted-cded9.firebaseapp.com",
  projectId: "ghosted-cded9",
  storageBucket: "ghosted-cded9.appspot.com",
  messagingSenderId: "886947234044",
  appId: "1:886947234044:web:961f7742766a373bd01779",
  databaseURL:"https://ghosted-cded9-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db =getFirestore();
export const storage= getStorage()
export const database= getDatabase()