import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { createContext, useContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export const GlobalProvider = ({children}) => {
  const [authData, setAuthData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [friendsCache, setFriendsCache] = useState(null);
  const [snipesCache, setSnipesCache] = useState(null);
  const globalState = {
    authData,
    userData: {...userData, currentTarget},
    friendsCache,
    snipesCache,
  };

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, user => {
      setAuthData(user);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!authData) return; // No user is logged in
    if (authData.uid === userData?.id) return; // User data is already fetched

    // Query the database for the user's data
    const userRef = doc(FIREBASE_STORE, "Users", authData.uid);
    getDoc(userRef).then((userResult) => {
      if (userResult.exists()) {
        const userResultData = userResult.data();
        const avatar_ref = userResultData.avatar_url;
        // Query the database for the user's avatar
        const avatarRef = ref(FIREBASE_STORAGE, avatar_ref);
        getDownloadURL(avatarRef).then((avatar_url) => {
          setUserData({
            id: authData.uid,
            username: userResultData.username,
            name: userResultData.name,
            email: userResultData.email,
            avatar_ref,
            avatar_url,
            avatar_blob: null // For now
            // current target fetched elsewhere
          });
        });
      }
    });
  }, [authData]);

  useEffect(() => {
    if (!authData) return; // No user is logged in
    
    // Get the user's target
    const targetRef = doc(FIREBASE_STORE, "Targets", authData.uid);
    getDoc(targetRef).then((result) => {
      if (result.exists()) {
        setCurrentTarget(result.data().target_id);
      }
    });
  }, [authData]);

  useEffect(() => {
    if (!authData) return; // No user is logged in

    // Query the database for the user's friends
    const friendsRef = doc(FIREBASE_STORE, "Friends", authData.uid);
    getDoc(friendsRef).then((friendsResult) => {
      if (friendsResult.exists()) {
        const friendsArray = friendsResult.data().friends;
        for (let i = 0; i < friendsArray.length; i++) {
          if (friendsCache && friendsCache[friendsArray[i]]) continue; // Friend is already cached

          const friendRef = doc(FIREBASE_STORE, "Users", friendsArray[i]);
          getDoc(friendRef).then((friendResult) => {
            if (friendResult.exists()) {
              const friendData = friendResult.data();
              const avatar_ref = friendData.avatar_url;
              // Query the database for the user's avatar
              const avatarRef = ref(FIREBASE_STORAGE, avatar_ref);
              getDownloadURL(avatarRef).then((avatar_url) => {
                setFriendsCache((prev) => ({
                  ...prev,
                  [friendsArray[i]]: {
                    username: friendData.username,
                    name: friendData.name,
                    avatar_ref,
                    avatar_url,
                    avatar_blob: null // For now
                  }
                }));
              });
            }
          });
        }
      }
    });
  }, [authData]);

  return (
    <GlobalContext.Provider value={globalState}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);