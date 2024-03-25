// import React, {createContext, useContext, useEffect, useState} from 'react';
// import {getAuth, onAuthStateChanged, User} from 'firebase/auth';

// // export const UserContext = createContext(null);
// export const UserContext = createContext<User | null>(null);

// export const UserProvider = ({children}) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   // const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     const auth = getAuth(); // Get the Firebase Auth instance
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       console.log('Authentication state changed:', user); // Log the user object to see when this updates
//       setCurrentUser(user); // Update state with the current user or null
//     });

//     return () => unsubscribe(); // Cleanup on unmount
//   }, []);

//   return (
//     <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
//   );
// };

// export const useCurrentUser = () => useContext(UserContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {getAuth, onAuthStateChanged, User} from 'firebase/auth';

// Create a context with a generic type of User | null
export const UserContext = createContext<User | null>(null);

// Specify the type for the props of UserProvider
type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  // Here you specify that currentUser can be a User object or null
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

// Hook to use the current user context
export const useCurrentUser = () => useContext(UserContext);

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from 'react';
// import {getAuth, onAuthStateChanged, User as FirebaseUser} from 'firebase/auth';
// import {doc, getDoc} from 'firebase/firestore'; // Import these Firestore functions
// import {FIREBASE_STORE} from '../../firebase'; // Make sure this path is correct for your setup

// // Extend your user context to include both Firebase Auth user and custom user data
// export interface UserContextType {
//   authUser: FirebaseUser | null; // User from Firebase Auth
//   isSnipingEnabled: boolean; // Custom user data
// }

// // Initialize your context with null or appropriate default values
// export const UserContext = createContext<UserContextType | null>(null);

// type UserProviderProps = {
//   children: ReactNode;
// };

// export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
//   const [currentUser, setCurrentUser] = useState<UserContextType | null>(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async authUser => {
//       if (authUser) {
//         // Fetch additional user data from Firestore when a user is logged in
//         const userRef = doc(FIREBASE_STORE, 'Users', authUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setCurrentUser({
//             authUser,
//             isSnipingEnabled: docSnap.data().isSnipingEnabled || false,
//           });
//         } else {
//           // Handle the case where there is a user but no additional data in Firestore
//           setCurrentUser({authUser, isSnipingEnabled: false});
//         }
//       } else {
//         // No user is signed in
//         setCurrentUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
//   );
// };

// // Hook to use the current user context
// export const useCurrentUser = () => useContext(UserContext);
