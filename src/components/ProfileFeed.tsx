import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextStyle,
  Dimensions,
} from 'react-native';
import getUserFriends from '../utils/getUserFriends';
import {Snipe} from '../types/Snipe';
import {FIREBASE_AUTH, FIREBASE_STORE, FIREBASE_STORAGE} from '../../firebase';
import {getDownloadURL, ref} from 'firebase/storage';

import {
  collection,
  query,
  where,
  orderBy,
  doc,
  getDocs,
} from 'firebase/firestore';
import {ListRenderItemInfo} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const MARGIN = 0;
const IMAGE_SIZE = (screenWidth - MARGIN * 4) / 3; // For 3 columns and margin on each side of the image

type ProfileFeedProps = {
  user_id: string;
};

const ProfileFeed = ({user_id}: ProfileFeedProps) => {
  const [selectedFeed, setSelectedFeed] = useState('SnipesOfMe');
  const [userFriends, setUserFriends] = useState<string[]>([]);
  const [snipesOfMePosts, setSnipesOfMePosts] = useState<Snipe[]>([]);
  const [snipesTakenPosts, setSnipesTakenPosts] = useState<Snipe[]>([]);

  useEffect(() => {
    const fetchUserFriends = async () => {
      if (FIREBASE_AUTH.currentUser) {
        const friends = await getUserFriends(FIREBASE_AUTH.currentUser.uid);
        setUserFriends(friends);
      } else {
        console.log('User is not authenticated.');
      }
    };
    fetchUserFriends();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch "SnipesOfMe"
        const snipesOfMeQuery = query(
          collection(FIREBASE_STORE, 'Posts'),
          where('target_id', '==', user_id),
          orderBy('timestamp', 'desc'),
        );
        const snipesOfMeSnapshot = await getDocs(snipesOfMeQuery);
        const snipesOfMeDataPromises = snipesOfMeSnapshot.docs.map(
          async doc => {
            const data = doc.data() as Omit<Snipe, 'image_url'>;
            const storageRef = ref(FIREBASE_STORAGE, data.image);
            const image_url = await getDownloadURL(storageRef);
            return {
              id: doc.id,
              approved: data.approved,
              image: data.image,
              image_url, // Assuming your documents have this field; adjust as necessary
              target_id: data.target_id,
              sniper_id: data.sniper_id,
              timestamp: data.timestamp,
            } as Snipe;
          },
        );
        const snipesOfMeData = await Promise.all(snipesOfMeDataPromises);
        setSnipesOfMePosts(snipesOfMeData);

        // Fetch "SnipesTaken"
        const snipesTakenQuery = query(
          collection(FIREBASE_STORE, 'Posts'),
          where('sniper_id', '==', user_id),
          orderBy('timestamp', 'desc'),
        );
        const snipesTakenSnapshot = await getDocs(snipesTakenQuery);
        const snipesTakenDataPromises = snipesTakenSnapshot.docs.map(
          async doc => {
            const data = doc.data() as Omit<Snipe, 'image_url'>; // Cast the data to Snipe without 'image_url'
            // Get the download URL for the image from Firebase Storage
            const storageRef = ref(FIREBASE_STORAGE, data.image);
            const image_url = await getDownloadURL(storageRef);
            return {
              id: doc.id,
              approved: data.approved,
              image: data.image,
              image_url,
              target_id: data.target_id,
              sniper_id: data.sniper_id,
              timestamp: data.timestamp,
            } as Snipe;
          },
        );
        const snipesTakenData = await Promise.all(snipesTakenDataPromises);
        setSnipesTakenPosts(snipesTakenData);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    if (user_id) {
      fetchPosts();
    }
  }, [user_id, selectedFeed]);

  const getTextStyle = (feedName: string): TextStyle => ({
    color: selectedFeed === feedName ? 'white' : 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center' as 'center',
  });

  // const renderItem = ({item}: ListRenderItemInfo<Snipe>) => (
  //   // <View style={styles.imageContainer}>
  //   <Image source={{uri: item.image_url}} style={styles.image} />
  //   // </View>
  // );

  const renderItem = ({item}: ListRenderItemInfo<Snipe>) => (
    // <View style={styles.imageContainer}>
    <Image
      source={{uri: item.image_url}}
      style={{width: IMAGE_SIZE, height: IMAGE_SIZE, margin: MARGIN}}
    />

    // </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelectedFeed('SnipesOfMe')}>
          <View
            style={
              selectedFeed === 'SnipesOfMe'
                ? styles.selectedButton
                : styles.button
            }>
            <Text style={getTextStyle('SnipesOfMe')}>Snipes of Me</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelectedFeed('SnipesTaken')}>
          <View
            style={
              selectedFeed === 'SnipesTaken'
                ? styles.selectedButton
                : styles.button
            }>
            <Text style={getTextStyle('SnipesTaken')}>Snipes Taken</Text>
          </View>
        </TouchableOpacity>
      </View>
      {(userFriends.includes(user_id) ||
        (FIREBASE_AUTH.currentUser &&
          user_id === FIREBASE_AUTH.currentUser.uid)) && (
        <FlatList
          data={
            selectedFeed === 'SnipesOfMe' ? snipesOfMePosts : snipesTakenPosts
          }
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3}
          horizontal={false}
          contentContainerStyle={{padding: MARGIN}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'violet',
  },
  // imageContainer: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   margin: 1,
  // },
  image: {
    // height: 100,
    flex: 1,
    aspectRatio: 1 / 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'black',
  },
  selectedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'black',
    borderBottomColor: 'white',
    borderBottomWidth: 5.2,
  },
  touchable: {
    flex: 1,
    // borderColor: 'red', // Border color for debugging
    // borderWidth: 1, // Border width for debugging
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background for debugging
  },
});

export default ProfileFeed;
