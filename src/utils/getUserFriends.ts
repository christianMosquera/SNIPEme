import {doc, getDoc} from 'firebase/firestore';
import {FIREBASE_STORE} from '../../firebase';

const getUserFriends = async (userId: string) => {
  try {
    const userRef = doc(FIREBASE_STORE, 'Friends', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const friends = docSnap.data().friends;
      return friends;
    } else {
      console.log('User document does not exist');
      return [];
    }
  } catch (error) {
    console.error('Error fetching friends list:', error);
    return [];
  }
};

export default getUserFriends;
