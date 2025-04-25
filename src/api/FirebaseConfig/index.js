import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAHst8CbQzzCs0lwqzT6W6SGXh9f3Xm2ak",
    authDomain: "resume-site-alex-bailey.firebaseapp.com",
    databaseURL: "https://resume-site-alex-bailey-default-rtdb.firebaseio.com",
    projectId: "resume-site-alex-bailey",
    storageBucket: "resume-site-alex-bailey.firebasestorage.app",
    messagingSenderId: "805439019259",
    appId: "1:805439019259:web:d001e798e1d94adc1db85e",
};

export default function StartFire() {
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  return database;
};

export function GetAuth() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  return auth;
};

export function UseAuth() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const auth = GetAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) =>
      setCurrentUser(user)
    );
    return unSubscribe;
  }, []);
  return currentUser;
};

export function GetUser() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  let loggedIn = false;
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) { loggedIn = true; } 
  });
  return loggedIn;
};

export function Storage() {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  return storage;
};
