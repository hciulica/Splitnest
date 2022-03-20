import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyArlw24z_EooHlBlYBk0qTLPEe9qfHiLvs',
  authDomain: 'splitnest.firebaseapp.com',
  projectId: 'splitnest',
  storageBucket: 'splitnest.appspot.com',
  messagingSenderId: '459980775376',
  appId: '1:459980775376:web:1ca30fc526d6e80de3e3d5',
};

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
export const db = getFirestore();
export const storage = getStorage(app);