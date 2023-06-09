import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBYwwZAEvPhCdT6lMLF9qVvv8FrB87DCks",
  authDomain: "socially-fbc33.firebaseapp.com",
  projectId: "socially-fbc33",
  storageBucket: "socially-fbc33.appspot.com",
  messagingSenderId: "305607020376",
  appId: "1:305607020376:web:af8b7ad1dd7030d2ea5f2d",
  measurementId: "G-EZ3HTGN4H7"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = initializeFirestore(app, {experimentalForceLongPolling: true,})

export { auth, db }