import React, {useEffect, useState} from 'react';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {FIREBASE_AUTH} from '../../firebase';
import {User, onAuthStateChanged} from 'firebase/auth';

const IndexStack = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, authUser => {
      setUser(authUser);
    });

    // Unsubscribe when component unmounts
    return unsubscribe;
  }, []);
  return user ? <AppStack /> : <AuthStack />;
};

export default IndexStack;
