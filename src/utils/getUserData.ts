import {useContext, useState, useEffect} from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import {FIREBASE_STORE, FIREBASE_STORAGE} from '../../firebase';
import {UserContext} from '../contexts/UserContext';
import {User} from 'firebase/auth';

type UserData = {
  [key: string]: any; // This allows dynamic access with string keys
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

const getUserData = (fieldsToFetch?: string[]) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(UserContext) as User | null;

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = currentUser?.uid; // Use UID from UserContext
      if (uid) {
        const userRef = doc(FIREBASE_STORE, 'Users', uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            let data = userSnap.data();
            if (fieldsToFetch) {
              // Use Promise.all to wait for all getImageUrl promises to resolve
              const filteredDataPromises = fieldsToFetch.map(async field => {
                if (field === 'avatar_url' && data[field]) {
                  // Convert avatar_url using getImageUrl
                  const url = await getImageUrl(data[field]);
                  return {[field]: url}; // Return an object with the field and its converted value
                } else {
                  return {[field]: data[field]}; // Return an object with the field and its original value
                }
              });

              // Resolve all promises and combine them into a single object
              const resolvedPromises = await Promise.all(filteredDataPromises);
              const filteredData = resolvedPromises.reduce((acc, current) => {
                return {...acc, ...current};
              }, {});

              setUserData(filteredData);
            } else {
              // If no specific fields to fetch, just set the whole data
              setUserData(data);
            }
          } else {
            console.log('No such user!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser, fieldsToFetch]); // Rerun effect if currentUser or fieldsToFetch changes

  return {userData, loading};
};

export default getUserData;
