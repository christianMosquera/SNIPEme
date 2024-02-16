import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC4GUIMgdgrzI3SSPimwKys-HHwbqJyVtA',
  authDomain: 'snipeme-22003.firebaseapp.com',
  projectId: 'snipeme-22003',
  storageBucket: 'snipeme-22003.appspot.com',
  messagingSenderId: '179678937601',
  appId: '1:179678937601:web:06ccecaf08bf19eeaf3600',
  measurementId: 'G-SK5H80GWXT',
};

const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const FIREBASE_STORE = getFirestore(FIREBASE_APP);
const storage = getStorage(FIREBASE_APP);

export {FIREBASE_APP, FIREBASE_AUTH, FIREBASE_STORE, storage};
