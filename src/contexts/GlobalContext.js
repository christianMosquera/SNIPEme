import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export const GlobalProvider = ({children}) => {
  const [globalState, setGlobalState] = useState({
    authData: null,
    userData: null,
    friendsCache: null,
    snipesCache: null,
  });

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase Auth instance
    const unsubscribe = onAuthStateChanged(auth, user => {
      setGlobalState({
        ...globalState,
        authData: user,
      });
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <GlobalContext.Provider value={globalState}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);