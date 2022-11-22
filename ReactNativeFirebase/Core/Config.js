// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoriPlLzcJlS8ComOrx3Vl8zAtkGm24OU",
  authDomain: "react-native-2aa59.firebaseapp.com",
  databaseURL: "https://react-native-2aa59-default-rtdb.firebaseio.com",
  projectId: "react-native-2aa59",
  storageBucket: "react-native-2aa59.appspot.com",
  messagingSenderId: "766571721187",
  appId: "1:766571721187:web:3108195a487ca16a1bb0d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);