import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBCgSUGWNrQqGnZILLds0R0aBrsx5Oct2Y',
  authDomain: 'task-management-system-4a3d1.firebaseapp.com',
  projectId: 'task-management-system-4a3d1',
  storageBucket: 'task-management-system-4a3d1.firebasestorage.app',
  messagingSenderId: '1063009350129',
  appId: '1:1063009350129:web:8d12f3be533f022e889450',
  measurementId: 'G-997V7GG948',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
