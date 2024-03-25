import {useContext, useState, useEffect} from 'react';
import {doc, onSnapshot} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import {FIREBASE_STORE, FIREBASE_STORAGE} from '../../firebase';
import {UserContext} from '../contexts/UserContext';
import {User} from 'firebase/auth';

type UserData = {
  // id?: string;
  avatar_url?: string | null;
  email?: string;
  name?: string;
  friendsCount?: number;
  isSnipingEnabled?: boolean;
  streak?: number;
  username?: string;
};

const getImageUrl = async (avatar_url: string) => {
  const storage = FIREBASE_STORAGE;
  const imageRef = ref(storage, avatar_url);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    return null; // Return null or a default URL if there's an error
  }
};

const useUserData = (fieldsToFetch?: string[]) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(UserContext) as User | null;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const uid = currentUser.uid;
    const userRef = doc(FIREBASE_STORE, 'Users', uid);

    const unsubscribe = onSnapshot(
      userRef,
      async documentSnapshot => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();

          if (fieldsToFetch) {
            // Same logic as before for filtering data and resolving image URLs
            const filteredDataPromises = fieldsToFetch.map(async field => {
              if (field === 'avatar_url' && data[field]) {
                const url = await getImageUrl(data[field]);
                return {[field]: url};
              } else {
                return {[field]: data[field]};
              }
            });
            const resolvedPromises = await Promise.all(filteredDataPromises);
            const filteredData = resolvedPromises.reduce((acc, current) => {
              return {...acc, ...current};
            }, {});
            setUserData(filteredData);
          } else {
            setUserData(data);
          }
        } else {
          console.log('No such user!');
        }
        setLoading(false);
      },
      error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      },
    );

    // Cleanup function to unsubscribe from the snapshot listener
    return () => unsubscribe();
  }, [currentUser, fieldsToFetch]);

  return {userData, loading};
};

export default useUserData;
