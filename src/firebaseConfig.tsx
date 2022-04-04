import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBRUABbYcvbcXCnRiXR97hq11aK1TEAGHQ",
  authDomain: "habit-tracker-34645.firebaseapp.com",
  projectId: "habit-tracker-34645",
  storageBucket: "habit-tracker-34645.appspot.com",
  messagingSenderId: "928018154744",
  appId: "1:928018154744:web:44aac3905a58b9c1f3670d",
  measurementId: "G-15YVSJH0CR"
};



const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const fireAuth = getAuth(app);


export let fireDB = getFirestore(app);
export {fireAuth}