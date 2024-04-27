import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS} from '../assets/Colors';
import {HomeStackParamList} from '../types/HomeStackParamList';
import {FIREBASE_AUTH, FIREBASE_STORE} from '../../firebase';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {modifyFriendsCount} from '../utils/friendsCountUtil';
import {Avatar} from 'react-native-paper';
import { sendNotification } from '../utils/pushnotification';

type FriendRequestProps = {
  userId: string;
  imageUrl: string;
  name: string;
  username: string;
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const FriendRequest = ({
  userId,
  imageUrl,
  name,
  username,
}: FriendRequestProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const navigateToProfile = (friendId: string) => {
    console.log(`Navigating to profile of friend with ID: ${friendId}`);
    navigation.push('ProfileHome', {user_id: friendId});
  };

  const acceptRequest = async (pendingRequestId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const currentUserId = FIREBASE_AUTH.currentUser.uid;

      const currentUserDocRef = doc(FIREBASE_STORE, 'Friends', currentUserId);
      const currentUserDoc = await getDoc(currentUserDocRef);
      if (!currentUserDoc.exists()) {
        await setDoc(currentUserDocRef, {friends: [], pendingRequests: []});
      }
      await updateDoc(currentUserDocRef, {
        pendingRequests: arrayRemove(pendingRequestId),
        friends: arrayUnion(pendingRequestId),
      });

      const requestUserDocRef = doc(
        FIREBASE_STORE,
        'Friends',
        pendingRequestId,
      );
      await updateDoc(requestUserDocRef, {
        friends: arrayUnion(currentUserId),
      });

      await modifyFriendsCount(currentUserId, 1);
      await modifyFriendsCount(pendingRequestId, 1);

      const notification = {
        target_id: pendingRequestId,
        sender_id: currentUserId,
        message_type: 'accepted',
      };
      sendNotification(notification);
    }
  };

  const rejectRequest = async (pendingRequestId: string) => {
    if (FIREBASE_AUTH.currentUser) {
      const currentUserId = FIREBASE_AUTH.currentUser.uid;

      const currentUserDocRef = doc(FIREBASE_STORE, 'Friends', currentUserId);
      await updateDoc(currentUserDocRef, {
        pendingRequests: arrayRemove(pendingRequestId),
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.friendContainer}
      onPress={() => navigateToProfile(userId)}>
      <View style={styles.friendInfo}>
        {imageUrl ? (
          <Avatar.Image source={{uri: imageUrl}} size={75} />
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
            {name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.username}>
            {username}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => acceptRequest(userId)}
            style={[
              styles.followButton,
              {backgroundColor: 'blue', marginRight: 10},
            ]}>
            <Text style={styles.followButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => rejectRequest(userId)}
            style={[styles.followButton, {backgroundColor: 'gray'}]}>
            <Text style={styles.followButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const imageSize = Math.min(screenWidth, screenHeight) * 0.15;
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '95%',
    alignSelf: 'center',
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

export default FriendRequest;
