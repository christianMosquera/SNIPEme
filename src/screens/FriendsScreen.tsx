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
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import {COLORS} from '../assets/Colors';
import {modifyFriendsCount} from '../utils/friendsCountUtil';

interface FriendType {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  imageUrl: string;
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const FriendsScreen = () => {
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFriends = async () => {
      if (FIREBASE_AUTH.currentUser) {
        const uid = FIREBASE_AUTH.currentUser.uid;
        const docRef = doc(FIREBASE_STORE, 'Friends', uid);

        const unsubscribe = onSnapshot(docRef, async docSnap => {
          if (docSnap.exists()) {
            const friendIds = docSnap.data().friends;
            const friendPromises = friendIds.map(async (friendId: string) => {
              const friendDocRef = doc(FIREBASE_STORE, 'Users', friendId);
              const friendDocSnap = await getDoc(friendDocRef);
              if (friendDocSnap.exists()) {
                const friendData = friendDocSnap.data();
                try {
                  const imageUrl = await getImageUrl(friendData.avatar_url);
                  return {id: friendId, ...friendData, imageUrl};
                } catch (error) {
                  console.error('Error fetching image URL:', error);
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
      console.error('Error getting download URL:', error);
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

  const renderFriendItem = ({item}: {item: FriendType}) => (
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
          onPress={() => unfollow(item.id)}
          style={[styles.followButton, {backgroundColor: 'gray'}]}>
          <Text style={styles.followButtonText}>Following</Text>
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

export default FriendsScreen;
