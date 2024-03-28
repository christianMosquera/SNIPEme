import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import {doc, getDoc, onSnapshot} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import FriendRequest from '../components/FriendRequest';
import {COLORS} from '../assets/Colors';

interface FriendType {
  userId: string;
  name: string;
  username: string;
  imageUrl: string;
}

const NotificationsScreen = () => {
  const [friendRequests, setFriendRequests] = useState<FriendType[]>([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (FIREBASE_AUTH.currentUser) {
        const uid = FIREBASE_AUTH.currentUser.uid;
        const docRef = doc(FIREBASE_STORE, 'Friends', uid);

        const unsubscribe = onSnapshot(docRef, async docSnap => {
          if (docSnap.exists()) {
            const requestIds = docSnap.data().pendingRequests;
            const requestPromises = requestIds.map(
              async (requestId: string) => {
                const requestDocRef = doc(FIREBASE_STORE, 'Users', requestId);
                const requestDocSnap = await getDoc(requestDocRef);
                if (requestDocSnap.exists()) {
                  const requestData = requestDocSnap.data();
                  try {
                    const imageUrl = await getImageUrl(requestData.avatar_url);
                    return {userId: requestId, ...requestData, imageUrl};
                  } catch (error) {
                    console.error('Error fetching image URL:', error);
                    return {userId: requestId, ...requestData, imageUrl: null};
                  }
                }
                return null;
              },
            );

            const friendDataWithUrls = await Promise.all(requestPromises);
            setFriendRequests(friendDataWithUrls);
          }
        });

        return () => unsubscribe();
      }
    };
    fetchFriendRequests();
  }, []);

  const getImageUrl = async (avatar_url: string) => {
    const storage = FIREBASE_STORAGE;
    const imageRef = ref(storage, avatar_url);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error getting download URL:', error);
    }
  };

  const renderRequestItem = ({item}: {item: FriendType}) => (
    <FriendRequest
      userId={item.userId}
      imageUrl={item.imageUrl}
      name={item.name}
      username={item.username}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={friendRequests}
        renderItem={renderRequestItem}
        keyExtractor={item => item.userId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: '5%',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.BACKGROUND,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '95%',
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default NotificationsScreen;
