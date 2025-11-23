import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1kt0dbutVL_bdw7miHQU-2urDzX_hayY",
  authDomain: "borges-6ccd6.firebaseapp.com",
  projectId: "borges-6ccd6",
  storageBucket: "borges-6ccd6.firebasestorage.app",
  messagingSenderId: "436033426642",
  appId: "1:436033426642:web:90789e733afeda1adc890b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.borgesAuth = {
  auth,
  signInWithGoogle: () => signInWithPopup(auth, provider),
  onAuthStateChanged,
  signOut: () => signOut(auth)
};
