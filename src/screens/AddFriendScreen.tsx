import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import {COLORS} from '../assets/Colors';
import {getDownloadURL, ref} from 'firebase/storage';
import {modifyFriendsCount} from '../utils/friendsCountUtil';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ProfileStackParamList} from '../types/ProfileStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Avatar} from 'react-native-paper';
import {sendNotification} from '../utils/pushnotification';
import {HomeStackParamList} from '../types/HomeStackParamList';

interface FriendType {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  imageUrl: string;
  following: boolean;
  requested: boolean;
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const AddFriendScreen = () => {
  const route = useRoute();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<FriendType[]>([]);
  const navigationHome =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const navigationProfile =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const searchUsers = async (text: string) => {
    setSearchTerm(text);
    const usersCollection = collection(FIREBASE_STORE, 'Users');
    const searchTermNormalized = text.toLowerCase();
    const userQuery = query(
      usersCollection,
      where('username', '>=', searchTermNormalized),
      where('username', '<=', searchTermNormalized + '\uf8ff'),
    );
    const querySnapshot = await getDocs(userQuery);
    const userPromises = querySnapshot.docs.map(async doc => {
      const userData = doc.data();
      const userId = doc.id;
      if (userId === FIREBASE_AUTH.currentUser?.uid) {
        return null;
      }
      try {
        var imageUrl;
        if (userData.avatar_url) {
          imageUrl = await getImageUrl(userData.avatar_url);
        } else {
          imageUrl = null;
        }
        const following = await isFriend(userId);
        const requested = await requesting(userId);
        return {...userData, id: doc.id, imageUrl, following, requested};
      } catch (error) {
        console.error('Error fetching image URL in Add Friend Screen:', error);
        return {...userData, id: doc.id, imageUrl: null};
      }
    });
    const userDataWithUrls = await Promise.all(userPromises);
    setUsers(userDataWithUrls.filter(user => user !== null) as FriendType[]);
  };

  const getImageUrl = async (avatar_url: string) => {
    const storage = FIREBASE_STORAGE;
    const imageRef = ref(storage, avatar_url);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error getting download URL in Add Friend:', error);
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
            `In AddFriendScreen, isFriend: Friends document for current user (${FIREBASE_AUTH.currentUser.uid}) does not exist.`,
          );
          return false;
        }
      } catch (error) {
        console.error(
          `In AddFriendScreen, isFriend: Error checking friendship status for user ${userId} with current user ${FIREBASE_AUTH.currentUser.uid}:`,
          error,
        );
        return false;
      }
    }
  };

  const followRequest = async (clickedUserId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const currentUserId = FIREBASE_AUTH.currentUser.uid;
      const clickedUserDocRef = doc(FIREBASE_STORE, 'Friends', clickedUserId);
      const clickedUserDoc = await getDoc(clickedUserDocRef);

      if (!clickedUserDoc.exists()) {
        await setDoc(clickedUserDocRef, {friends: [], pendingRequests: []});
      }

      await updateDoc(clickedUserDocRef, {
        pendingRequests: arrayUnion(currentUserId),
      });

      setUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.id === clickedUserId) {
            return {...user, requested: true};
          }
          return user;
        });
      });
      const notification = {
        target_id: clickedUserId,
        sender_id: currentUserId,
        message_type: 'friend',
      };
      sendNotification(notification);
    }
  };

  const unRequest = async (clickedUserId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const currentUserId = FIREBASE_AUTH.currentUser.uid;
      const clickedUserDocRef = doc(FIREBASE_STORE, 'Friends', clickedUserId);

      await updateDoc(clickedUserDocRef, {
        pendingRequests: arrayRemove(currentUserId),
      });

      setUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.id === clickedUserId) {
            return {...user, requested: false};
          }
          return user;
        });
      });
    }
  };

  const requesting = async (userId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const currentUid = FIREBASE_AUTH.currentUser.uid;
      const store = FIREBASE_STORE;
      try {
        const docRef = doc(store, 'Friends', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dataArray = docSnap.data().pendingRequests;
          return dataArray.includes(currentUid);
        } else {
          console.log(
            `In AddFriendScreen, requesting: No document found for user ID ${userId} in Friends collection. No pending requests can exist.`,
          );
          return false;
        }
      } catch (error) {
        console.error(
          `In AddFriendScreen, requesting: Error accessing Friends document for user ID ${userId} (checking from current user ID ${currentUid}):`,
          error,
        );
        return false;
      }
    }
  };

  const handleFollow = async (user_id: string) => {
    if (await isFriend(user_id)) {
      return unfollow(user_id);
    } else if (await requesting(user_id)) {
      return unRequest(user_id);
    } else {
      followRequest(user_id);
    }
  };

  const unfollow = async (friend_id: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const updatedUsers = users.map(user =>
        user.id === friend_id ? {...user, following: false} : user,
      );
      setUsers(updatedUsers);

      const current_uid = FIREBASE_AUTH.currentUser.uid;
      const userDocRef = doc(FIREBASE_STORE, 'Friends', current_uid);
      const friendDocRef = doc(FIREBASE_STORE, 'Friends', friend_id);

      await updateDoc(userDocRef, {
        friends: arrayRemove(friend_id),
      });
      await modifyFriendsCount(current_uid, -1);

      await updateDoc(friendDocRef, {
        friends: arrayRemove(current_uid),
      });
      await modifyFriendsCount(friend_id, -1);
    }
  };

  const getButtonText = (item: FriendType): string => {
    if (item.following) {
      return 'Following';
    } else if (item.requested) {
      return 'Requested';
    } else {
      return 'Follow';
    }
  };

  const getButtonColor = (item: FriendType): string => {
    if (item.following || item.requested) {
      return 'gray';
    } else {
      return 'blue';
    }
  };

  const renderUserItem = ({item}: {item: FriendType}) => (
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
        <TouchableOpacity
          onPress={() => handleFollow(item.id)}
          style={[
            styles.followButton,
            {backgroundColor: getButtonColor(item)},
          ]}>
          <Text style={styles.followButtonText}>{getButtonText(item)}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const navigateToProfile = (friendId: string) => {
    console.log(`Navigating to profile of friend with ID: ${friendId}`);
    console.log(route.name);
    if (route.name === 'AddFriendHome') {
      navigationHome.push('ProfileHome', {user_id: friendId});
    } else {
      navigationProfile.push('ProfileMain', {user_id: friendId});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        onChangeText={text => searchUsers(text)}
        value={searchTerm}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor={COLORS.white}
      />
      <FlatList
        data={users}
        renderItem={renderUserItem}
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
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
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
export default AddFriendScreen;
