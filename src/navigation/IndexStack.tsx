import React, {useEffect, useState} from 'react';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {FIREBASE_AUTH, FIREBASE_STORE} from '../../firebase';
import {User, onAuthStateChanged} from 'firebase/auth';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { Text } from 'react-native-paper';

const IndexStack = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, authUser => {
      setUser(authUser);
    });

    // Unsubscribe when component unmounts
    return unsubscribe;
  }, []);

  // Check if user has unapproved snipes
  const [userHasUnapprovedSnipes, setUserHasUnapprovedSnipes] = useState<Boolean>(false);
  useEffect(() => {
    if (!user) return;

    // Query the database for unapproved snipes
    const postsRef = collection(FIREBASE_STORE, "Posts");
    const unapprovedSnipesQuery = query(postsRef, 
      and(
        where("target_id", "==", user.uid),
        where("approved", "==", false)
      ));
    const getUnapprovedSnipes = async () => {
      return await getDocs(unapprovedSnipesQuery);
    }

    // Set state to false if there are no snipes, true otherwise
    getUnapprovedSnipes().then((result) => {
      console.log(result.docs.length > 0);
      setUserHasUnapprovedSnipes(result.docs.length > 0);
    });
  }, [user]);

  if (user) {
    if (userHasUnapprovedSnipes == false) {
      return <Text>Not approved</Text>
    } else {
      return <AppStack />;
    }
  } else {
    return <AuthStack />;
  }
};

export default IndexStack;
