// firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcfL2-tzduXNsi_NTjAaXIRzuo6o4tHOk", // <-- Bu geçerli olmalı
  authDomain: "kurbanpazarim-902a3.firebaseapp.com",
  projectId: "kurbanpazarim-902a3",
  storageBucket: "kurbanpazarim-902a3.appspot.com", // <-- DÜZELTME BURADA
  messagingSenderId: "128172647796",
  appId: "1:128172647796:web:24083e4600aa28ba81b821",
  measurementId: "G-Y0TBMPP8QW",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
