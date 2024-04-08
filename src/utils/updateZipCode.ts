import {doc, updateDoc} from 'firebase/firestore';
import {FIREBASE_STORE} from '../../firebase';

const updateZipCode = async (userId: string, newZipCode: string) => {
  try {
    const userRef = doc(FIREBASE_STORE, 'Users', userId);
    await updateDoc(userRef, {
      zipcode: newZipCode,
    });
    console.log('Zip code updated successfully');
  } catch (error) {
    console.error('Error updating zip code:', error);
    throw error;
  }
};

export default updateZipCode;
