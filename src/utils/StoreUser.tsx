import {User} from '@firebase/auth';
import {FIREBASE_STORE} from '../../firebase';
import {collection, doc, setDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserInFirestore = async (
  user: User,
  username: string,
  name: string,
) => {
  const {uid, email} = user;

  try {
    const usersCollection = collection(FIREBASE_STORE, 'Users');
    const friendsCollection = collection(FIREBASE_STORE, 'Friends');
    const userRef = doc(usersCollection, uid);
    const token = await AsyncStorage.getItem('notifToken');
    const friendRef = doc(friendsCollection, uid);

    await setDoc(userRef, {
      email,
      username,
      name,
      avatar_url: null,
      streak: 0,
      friendsCount: 0,
      device_token: token,
      isSnipingEnabled: true,
    });

    await setDoc(friendRef, {
      friends: [],
      pendingRequests: [],
    });
  } catch (error) {
    console.error('Error storing user in Firestore:', error);
  }
};

export default storeUserInFirestore;
