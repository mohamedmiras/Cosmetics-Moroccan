import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBlHvZpgFb_oeZhEerCLw_7TG5fQkuDZa4",
  authDomain: "moroccan-cosmetics.firebaseapp.com",
  databaseURL: "https://moroccan-cosmetics-default-rtdb.firebaseio.com",
  projectId: "moroccan-cosmetics",
  storageBucket: "moroccan-cosmetics.firebasestorage.app",
  messagingSenderId: "127120865741",
  appId: "1:127120865741:web:7315ac3839a8b1491aec84"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
