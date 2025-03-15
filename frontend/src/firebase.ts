// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByAMkTCtUS0TnhccMpmTzCG409aqQrJHM",
  authDomain: "ai-encounter.firebaseapp.com",
  projectId: "ai-encounter",
  storageBucket: "ai-encounter.firebasestorage.app",
  messagingSenderId: "845505286913",
  appId: "1:845505286913:web:9c4a73ab82f8ed19c94100",
  measurementId: "G-BTNNBDXT8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

// Define Genkit flow callables
export const genkitGreet = httpsCallable(functions, "greeterCallable");
export const genkitGenerateEncounter = httpsCallable(functions, "generateEncounterCallable");
export const genkitPerformAction = httpsCallable(functions, "performActionCallable");