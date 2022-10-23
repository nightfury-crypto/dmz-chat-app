import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAe_5oL11-p4OLRuIjXsWIDf6Fh_vFmDVs",
    authDomain: "dmz-chat.firebaseapp.com",
    projectId: "dmz-chat",
    storageBucket: "dmz-chat.appspot.com",
    messagingSenderId: "483271828225",
    appId: "1:483271828225:web:46874dc30153932fb6f100",
    measurementId: "G-3ZQT7N5JH2"
  };
  
  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth();
  export const db = getFirestore();