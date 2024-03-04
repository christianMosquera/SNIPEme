import React, {createContext, useContext, useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log('Authentication state changed:', user); // Log the user object to see when this updates
      setCurrentUser(user); // Update state with the current user or null
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(UserContext);
