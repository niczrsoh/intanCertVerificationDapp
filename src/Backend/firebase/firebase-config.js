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
  apiKey: "AIzaSyCVC0epwoWfcJxeTYDtHfXkdkHvk5L-E0U",
  authDomain: "azure-cert-dapp.firebaseapp.com",
  projectId: "azure-cert-dapp",
  storageBucket: "azure-cert-dapp.firebasestorage.app",
  messagingSenderId: "885307372821",
  appId: "1:885307372821:web:fca5a111700dcba136651c",
  measurementId: "G-L65DB0B63N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);