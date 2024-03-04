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
const AddFriendScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<FriendType[]>([]);

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
        const imageUrl = await getImageUrl(userData.avatar_url);
        const following = await isFriend(userId);
        return {...userData, id: doc.id, imageUrl, following};
      } catch (error) {
        console.error('Error fetching image URL:', error);
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
      console.error('Error getting download URL:', error);
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
          console.log('No such document!');
          return false;
        }
      } catch (error) {
        console.error('Error getting document:', error);
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
        await updateDoc(currentUserDocRef, {friends: []});
      }

      if (!clickedUserDoc.exists()) {
        await updateDoc(clickedUserDocRef, {friends: []});
      }

      await updateDoc(currentUserDocRef, {friends: arrayUnion(clickedUserId)});
      await modifyFriendsCount(currentUserId, 1); // Increment the current user's friend count

      await updateDoc(clickedUserDocRef, {friends: arrayUnion(currentUserId)});
      await modifyFriendsCount(clickedUserId, 1); // Increment the clicked user's friend count
    }
  };

  const handleFollow = async (user_id: string) => {
    if (await isFriend(user_id)) {
      return unfollow(user_id);
    } else {
      return follow(user_id);
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
      await modifyFriendsCount(current_uid, -1); // Decrement the current user's friend count

      await updateDoc(friendDocRef, {
        friends: arrayRemove(current_uid),
      });
      await modifyFriendsCount(friend_id, -1); // Decrement the unfollowed user's friend count
    }
  };

  const renderUserItem = ({item}: {item: FriendType}) => (
    <TouchableOpacity
      style={styles.friendContainer}
      onPress={() => navigateToProfile(item.id)}>
      <View style={styles.friendInfo}>
        <Image
          style={styles.image}
          source={{
            uri: item.imageUrl,
          }}
        />
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendName}>{item.username}</Text>
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
      </View>
    </TouchableOpacity>
  );

  const navigateToProfile = (friendId: string) => {
    console.log(`Navigating to profile of friend with ID: ${friendId}`);
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: 'white',
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
});
export default AddFriendScreen;
