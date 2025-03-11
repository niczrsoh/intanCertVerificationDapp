// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration, this is the connection key connect
// to your firebase. 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYlXnuYsVJ88eSYfc0OV0t_z9zQ39x0LI",
  authDomain: "hci-cert-dapp.firebaseapp.com",
  projectId: "hci-cert-dapp",
  storageBucket: "hci-cert-dapp.firebasestorage.app",
  messagingSenderId: "419560932345",
  appId: "1:419560932345:web:ca55abb104c01d72887328",
  measurementId: "G-QQV3DEJDQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);