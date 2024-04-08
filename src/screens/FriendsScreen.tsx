import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import {COLORS} from '../assets/Colors';
import {modifyFriendsCount} from '../utils/friendsCountUtil';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../types/ProfileStackParamList';
import {Avatar} from 'react-native-paper';

interface FriendType {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  imageUrl: string;
  following: boolean;
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const FriendsScreen = () => {
  const route = useRoute<RouteProp<ProfileStackParamList>>();
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const user_id = route.params?.user_id;
  if (!user_id) {
    return (
      <SafeAreaView>
        <Text>User ID is undefined</Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    const loadFriends = async () => {
      if (FIREBASE_AUTH.currentUser) {
        const uid = FIREBASE_AUTH.currentUser.uid;
        const docRef = doc(FIREBASE_STORE, 'Friends', user_id);

        const unsubscribe = onSnapshot(docRef, async docSnap => {
          if (docSnap.exists()) {
            const friendIds = docSnap.data().friends;
            const friendPromises = friendIds.map(async (friendId: string) => {
              const friendDocRef = doc(FIREBASE_STORE, 'Users', friendId);
              const friendDocSnap = await getDoc(friendDocRef);
              if (friendDocSnap.exists()) {
                const friendData = friendDocSnap.data();
                try {
                  if (friendData.avatar_url) {
                    const imageUrl = await getImageUrl(friendData.avatar_url);
                    const following = await isFriend(friendId);
                    return {id: friendId, ...friendData, imageUrl, following};
                  } else {
                    const following = await isFriend(friendId);
                    return {
                      id: friendId,
                      ...friendData,
                      imageUrl: null,
                      following,
                    };
                  }
                } catch (error) {
                  console.error(
                    'Error fetching image URL in Friends screen:',
                    error,
                  );
                  return {id: friendId, ...friendData, imageUrl: null};
                }
              }
              return null;
            });

            const friendDataWithUrls = await Promise.all(friendPromises);
            setFriends(friendDataWithUrls);
          }
        });

        return () => unsubscribe();
      }
    };

    loadFriends();
  }, []);

  const searchUsers = (text: string) => {
    setSearchTerm(text);
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getImageUrl = async (avatar_url: string) => {
    const storage = FIREBASE_STORAGE;
    const imageRef = ref(storage, avatar_url);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error(
        `In FriendScreen, getImageUrl: Error getting download URL for avatar: ${avatar_url}`,
        error,
      );
    }
  };

  const unfollow = async (friend_id: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const current_uid = FIREBASE_AUTH.currentUser.uid;
      const userDocRef = doc(FIREBASE_STORE, 'Friends', current_uid);
      const friendDocRef = doc(FIREBASE_STORE, 'Friends', friend_id);

      await updateDoc(userDocRef, {
        friends: arrayRemove(friend_id),
      });
      await modifyFriendsCount(friend_id, -1);

      await updateDoc(friendDocRef, {
        friends: arrayRemove(current_uid),
      });
      await modifyFriendsCount(current_uid, -1);
    }
  };

  const isFriend = async (userId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const store = FIREBASE_STORE;
      try {
        const docRef = doc(store, 'Friends', FIREBASE_AUTH.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dataArray = docSnap.data().friends;
          return dataArray.includes(userId);
        } else {
          console.log(
            'In FriendsScreen, isFriend: Friend list document for current user does not exist.',
          );
          return false;
        }
      } catch (error) {
        console.error(
          `In FriendsScreen, isFriend: Error checking if user ${userId} is a friend.`,
          error,
        );
        return false;
      }
    }
  };

  const follow = async (clickedUserId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const currentUserId = FIREBASE_AUTH.currentUser.uid;

      const currentUserDocRef = doc(FIREBASE_STORE, 'Friends', currentUserId);
      const currentUserDoc = await getDoc(currentUserDocRef);

      const clickedUserDocRef = doc(FIREBASE_STORE, 'Friends', clickedUserId);
      const clickedUserDoc = await getDoc(clickedUserDocRef);

      if (!currentUserDoc.exists()) {
        await setDoc(currentUserDocRef, {friends: []});
      }

      if (!clickedUserDoc.exists()) {
        await setDoc(clickedUserDocRef, {friends: []});
      }

      await updateDoc(currentUserDocRef, {
        friends: arrayUnion(clickedUserId),
      });
      await modifyFriendsCount(currentUserId, 1);

      await updateDoc(clickedUserDocRef, {
        friends: arrayUnion(currentUserId),
      });
      await modifyFriendsCount(clickedUserId, 1);
    }
  };

  const handleFollow = async (user_id: string) => {
    if (await isFriend(user_id)) {
      return unfollow(user_id);
    } else {
      return follow(user_id);
    }
  };

  const renderFriendItem = ({item}: {item: FriendType}) => (
    <TouchableOpacity
      style={styles.friendContainer}
      onPress={() => navigateToProfile(item.id)}>
      <View style={styles.friendInfo}>
        {item.imageUrl ? (
          <Avatar.Image source={{uri: item.imageUrl}} size={75} />
        ) : (
          <Avatar.Icon
            style={styles.avatar}
            size={75}
            color="white"
            icon="account"
          />
        )}
        <View style={styles.textContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
            {item.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>
            {item.username}
          </Text>
        </View>
        {FIREBASE_AUTH.currentUser &&
          item.id !== FIREBASE_AUTH.currentUser.uid && (
            <TouchableOpacity
              onPress={() => handleFollow(item.id)}
              style={[
                styles.followButton,
                {backgroundColor: item.following ? 'gray' : 'blue'},
              ]}>
              <Text style={styles.followButtonText}>
                {item.following ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </TouchableOpacity>
  );

  const navigateToProfile = (friendId: string) => {
    console.log(`Navigating to profile of friend with ID: ${friendId}`);
    navigation.push('ProfileMain', {user_id: friendId});
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        onChangeText={text => searchUsers(text)}
        value={searchTerm}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor={COLORS.white}
      />
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const imageSize = Math.min(screenWidth, screenHeight) * 0.15;
const styles = StyleSheet.create({
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
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followButton: {
    width: 90,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  followButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: '15%',
    color: COLORS.white,
    width: '95%',
    alignSelf: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
    color: COLORS.white,
  },
  username: {
    fontSize: 14,
    overflow: 'hidden',
    color: COLORS.white,
  },
  avatar: {
    backgroundColor: 'gray',
  },
});

export default FriendsScreen;
