import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import {FIREBASE_STORE, FIREBASE_STORAGE} from '../../firebase'; // Make sure to import Firebase Storage instance
import {User} from 'firebase/auth';

interface TargetContextState {
  targetAvatar: string | null;
  setTargetAvatar: (avatar: string | null) => void;
}

export const TargetContext = createContext<TargetContextState>({
  targetAvatar: null,
  setTargetAvatar: () => {},
});

interface TargetProviderProps {
  children: ReactNode;
  currentUser: User | null;
}

export const TargetProvider: React.FC<TargetProviderProps> = ({
  children,
  currentUser,
}) => {
  const [targetAvatar, setTargetAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (!currentUser) {
        console.log('In TargetContext, No current user available');
        setTargetAvatar(null);
        return;
      }

      console.log(
        'In TargetContext, Fetching target for user:',
        currentUser.uid,
      );
      const targetRef = doc(FIREBASE_STORE, 'Targets', currentUser.uid);
      const targetDoc = await getDoc(targetRef);

      if (targetDoc.exists()) {
        const targetId = targetDoc.data().target_id;
        console.log('In TargetContext, Found target ID:', targetId);

        if (targetId) {
          const userRef = doc(FIREBASE_STORE, 'Users', targetId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const avatarUrl = userDoc.data().avatar_url;
            console.log('In TargetContext, Avatar path fetched:', avatarUrl);
            if (avatarUrl) {
              const storageRef = ref(FIREBASE_STORAGE, avatarUrl); // Use the correct Firebase Storage instance
              const downloadUrl = await getDownloadURL(storageRef);
              console.log('In TargetContext, Download URL:', downloadUrl);
              setTargetAvatar(downloadUrl);
            } else {
              console.log('In TargetContext, No avatar path available');
              setTargetAvatar(null);
            }
          } else {
            console.log(
              'In TargetContext, User document for target does not exist',
            );
            setTargetAvatar(null);
          }
        }
      } else {
        console.log('In TargetContext, Target document does not exist');
        setTargetAvatar(null);
      }
    };

    fetchAvatarUrl();
  }, [currentUser]);

  return (
    <TargetContext.Provider value={{targetAvatar, setTargetAvatar}}>
      {children}
    </TargetContext.Provider>
  );
};
