import React, {useEffect, useState} from 'react';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import ApprovalScreen from '../screens/ApprovalScreen';
import {FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import {User, onAuthStateChanged} from 'firebase/auth';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { Snipe } from '../types/Snipe';
import { getDownloadURL, ref } from 'firebase/storage';

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
  const [unapprovedSnipes, setUnapprovedSnipes] = useState<Array<Snipe>>([]);
  useEffect(() => {
    if (!user) return;

    // Query the database for unapproved snipes
    const postsRef = collection(FIREBASE_STORE, "Posts");
    const unapprovedSnipesQuery = query(postsRef, 
      and(
        where("target_id", "==", user.uid),
        where("approved", "==", false)
      ));

    // Set state to false if there are no snipes, true otherwise
    getDocs(unapprovedSnipesQuery).then(async (result) => {
      const resultArray = result.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Snipe;
      });
      for (let i = 0; i < resultArray.length; i++) {
        const sniperRef = ref(FIREBASE_STORAGE, resultArray[i].image);
        const url = await getDownloadURL(sniperRef);
        resultArray[i].image_url = url;
      }
      setUnapprovedSnipes(resultArray);
    });
  }, [user]);

  if (user) {
    if (unapprovedSnipes.length > 0) {
      return <ApprovalScreen unapprovedSnipes={unapprovedSnipes} setUnapprovedSnipes={setUnapprovedSnipes} />
    } else {
      return <AppStack />;
    }
  } else {
    return <AuthStack />;
  }
};

export default IndexStack;
