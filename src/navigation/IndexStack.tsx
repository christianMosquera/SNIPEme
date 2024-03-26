import React, {useEffect, useState} from 'react';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import ApprovalScreen from '../screens/ApprovalScreen';

import { useGlobalState } from '../contexts/GlobalContext';
import { GlobalContextType } from '../types/GlobalContextType';
import { Snipe } from '../types/Snipe';

const IndexStack = () => {
  const globalContext = useGlobalState() as unknown as GlobalContextType;
  const user = globalContext.authData;
  const snipes = globalContext.snipesCache;

  // Check if user has unapproved snipes
  const [unapprovedSnipes, setUnapprovedSnipes] = useState<Array<Snipe>>([]);
  useEffect(() => {
    if (!user) return;
    if (!snipes) return;

    setUnapprovedSnipes(snipes.filter((snipe) => snipe.target_id === user.uid && !snipe.approved));
  }, [user, snipes]);

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
