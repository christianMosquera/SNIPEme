import {FIREBASE_STORE} from '../../firebase';
import {collection, getDocs, query, where} from 'firebase/firestore';

const checkUsernameValid = async (username: string) => {
  const usersCollection = collection(FIREBASE_STORE, 'Users');
  const usernameQuery = query(
    usersCollection,
    where('username', '==', username),
  );
  const querySnapshot = await getDocs(usernameQuery);
  return querySnapshot.empty;
};

export default checkUsernameValid;
