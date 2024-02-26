import {User} from '@firebase/auth';
import {FIREBASE_STORE} from '../../firebase';
import {collection, doc, setDoc} from 'firebase/firestore';

const storeUserInFirestore = async (
  user: User,
  username: string,
  name: string,
) => {
  const {uid, email} = user;

  try {
    const usersCollection = collection(FIREBASE_STORE, 'Users');
    const userRef = doc(usersCollection, uid);

    await setDoc(userRef, {
      email,
      username,
      name,
    });
  } catch (error) {
    console.error('Error storing user in Firestore:', error);
  }
};

export default storeUserInFirestore;
