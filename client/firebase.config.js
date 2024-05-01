// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyANdwrZXLVf1srAefZSLbX9znGcga0lsqo',
  authDomain: 'chatsee-eb4a0.firebaseapp.com',
  projectId: 'chatsee-eb4a0',
  storageBucket: 'gs://chatsee-eb4a0.appspot.com',
  messagingSenderId: '183585772423',
  appId: '1:183585772423:web:98551f5a48b0d7ed23f922',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
