// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyD99zXo_--7CM0JcXA9NhvbzVvGx2CfscM",
  authDomain: "expensecalculator-1ca6a.firebaseapp.com",
  projectId: "expensecalculator-1ca6a",
  storageBucket: "expensecalculator-1ca6a.appspot.com",
  messagingSenderId: "1073269710223",
  appId: "1:1073269710223:web:c70c5b6b35cc6d8706bffa",
  measurementId: "G-T6T88070C7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.database();

export default firebase;