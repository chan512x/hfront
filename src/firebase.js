import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {

    apiKey: "AIzaSyC2cfZf7Q-3KemzEM0BZaZ30x-s7jSjqMw",
  
    authDomain: "main-3472b.firebaseapp.com",
  
    projectId: "main-3472b",
  
    storageBucket: "main-3472b.firebasestorage.app",
  
    messagingSenderId: "644167054456",
  
    appId: "1:644167054456:web:1e427870f2b781ba66298d"
  
  };
  

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);

export default app;