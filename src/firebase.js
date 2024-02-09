// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWyqSFCGNiYjIwt3cbpTPFhsqPLTjfoEk",
  authDomain: "realtor-clone-6a539.firebaseapp.com",
  projectId: "realtor-clone-6a539",
  storageBucket: "realtor-clone-6a539.appspot.com",
  messagingSenderId: "495237034001",
  appId: "1:495237034001:web:2b3a83b71e7c14636541b0"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db= getFirestore()