import {User} from '@firebase/auth';
import {FIREBASE_STORE} from '../../firebase'; // Import the Firebase Authentication and Firestore instances
import {collection, doc, setDoc} from 'firebase/firestore';
// Function to store user information in Firestore
const storeUserInFirestore = async (
  user: User,
  username: string,
  firstName: string,
  lastName: string,
) => {
  // Get user information
  const {uid, email} = user;

  try {
    // Create a reference to the user document in Firestore
    const usersCollection = collection(FIREBASE_STORE, 'Users');
    const userRef = doc(usersCollection, uid);

    // Check if the user document already exists
    await setDoc(userRef, {
      email,
      username,
      firstName,
      lastName,
      // You can add more fields as needed
    });
  } catch (error) {
    console.error('Error storing user in Firestore:', error);
  }
};

export default storeUserInFirestore;
