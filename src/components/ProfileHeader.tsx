// ProfileHeader.tsx

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {Text, Avatar, IconButton, Switch} from 'react-native-paper';
import {ProfileStackParamList} from '../types/ProfileStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import {collection, doc, getDoc, getDocs, query, updateDoc, where} from 'firebase/firestore';
import {FIREBASE_STORE, FIREBASE_AUTH} from '../../firebase';
import {useCurrentUser} from '../contexts/UserContext';
import getUserFriends from '../utils/getUserFriends';

type ProfileHeaderProps = {
  avatarUrl: string | null;
  username?: string;
  name?: string;
  streak?: number;
  friendsCount?: number;
  isSnipingEnabled?: boolean;
  user_id: string;
};
const isDebugMode = false;

const ProfileHeader = ({
  avatarUrl,
  username,
  name,
  streak,
  friendsCount,
  isSnipingEnabled = false,
  user_id,
}: ProfileHeaderProps) => {
  const [userFriends, setUserFriends] = useState<string[]>([]);
  const currentUser = useCurrentUser();

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

  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const [isSwitchOn, setIsSwitchOn] = React.useState(isSnipingEnabled);

  const updateUserSnipingStatus = async (isEnabled: boolean) => {
    if (!currentUser?.uid) return;

    const userDocRef = doc(FIREBASE_STORE, 'Users', currentUser.uid);

    try {
      await updateDoc(userDocRef, {
        isSnipingEnabled: isEnabled,
      });
      console.log('Updated sniping status successfully');

      // Need to handle the case where the user turns
      // off their sniping status before being sniped
      if (!isEnabled) {
        // Empty the current user's target
        const targetDocRef = doc(FIREBASE_STORE, 'Targets', currentUser.uid);
        await updateDoc(targetDocRef, {
          target_id: '',
        });

        // If the user has already been sniped, no more to do
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const postsCollection = collection(FIREBASE_STORE, 'Posts');
        const postsQuery = query(postsCollection, where('target_id', '==', currentUser.uid), where('timestamp', '>=', today));
        const postsResult = await getDocs(postsQuery);
        if (!postsResult.empty) return;

        // Remove the user from any place they are a target
        const targetsCollection = collection(FIREBASE_STORE, 'Targets');
        const targetsQuery = query(targetsCollection, where('target_id', '==', currentUser.uid));
        const targetsResult = await getDocs(targetsQuery)
        const snipers = targetsResult.docs;
        // Get current user's zipcode
        const userDoc = doc(FIREBASE_STORE, 'Users', currentUser.uid);
        const userDocResult = await getDoc(userDoc);
        const currentZipCode = userDocResult.data()?.zipcode;
        for (const user of snipers) {
          // Get the snipable friends of the user
          const sniperFriends = await getUserFriends(user.id);
          const usersCollection = collection(FIREBASE_STORE, 'Users');
          const usersQuery = query(usersCollection);
          const usersResult = await getDocs(usersQuery);
          const users = usersResult.docs
                        .filter(doc => doc.data().zipcode == currentZipCode && doc.data().isSnipingEnabled && sniperFriends.includes(doc.id))
                        .map(doc => doc.id);

          // Set the user's target to the new target
          // If they have no friends, they get no target
          let target = null;
          if (users.length != 0) {
            // Otherwise, assign a random target
            target = users[Math.floor(Math.random() * users.length)];
          }
          updateDoc(user.ref, { target_id: target });

          console.log("Gave", user.id, "new target", target);
        }
      }
    } catch (error) {
      console.error('Error updating sniping status:', error);
    }
  };

  const onToggleSwitch = () => {
    const newSwitchValue = !isSwitchOn;
    setIsSwitchOn(newSwitchValue);
    updateUserSnipingStatus(newSwitchValue);
  };

  const navigateFriends = () => {
    if (currentUser)
      if (userFriends.includes(user_id) || user_id === currentUser.uid) {
        navigation.push('Friends', {user_id: user_id});
      }
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => console.log('Username Text Button Pressed')}>
          <Text style={styles.text} variant="titleMedium">
            @{username}
          </Text>
        </TouchableOpacity>
        {user_id === FIREBASE_AUTH.currentUser?.uid && (
          <IconButton
            style={styles.settingsIcon}
            icon="cog"
            iconColor="white"
            size={30}
            onPress={() => navigation.navigate('Settings')}
          />
        )}
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.nameContainer}>
          {avatarUrl ? (
            <Avatar.Image source={{uri: avatarUrl}} size={110} />
          ) : (
            <Avatar.Icon
              style={styles.avatar}
              size={110}
              color="white"
              icon="account"
            />
          )}
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Name Text Button Pressed')}>
            <Text style={styles.name} variant="titleMedium">
              {name}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.streakContainer}>
          <Switch
            color="#F39334"
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
          />
          <Text style={styles.text} variant="bodyLarge">
            Sniping Status
          </Text>
        </View>
        <View style={styles.friendsContainer}>
          {typeof friendsCount === 'number' && (
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => navigation.push('Friends', {user_id: user_id})}>
              <Text style={styles.text} variant="titleMedium">
                {friendsCount}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => navigation.push('Friends', {user_id: user_id})}>
            <Text style={styles.text} variant="bodyLarge">
              Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'black',
  },
  topContainer: {
    // backgroundColor: 'magenta',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  middleContainer: {
    // backgroundColor: 'purple',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  streakContainer: {
    // backgroundColor: 'orange',
    flex: 1,
    alignItems: 'center',
  },
  nameContainer: {
    // backgroundColor: 'dodgerblue',
    flex: 1,
    alignItems: 'center',
  },
  friendsContainer: {
    // backgroundColor: 'green',
    flex: 1,
    alignItems: 'center',
  },
  snipingStatusContainer: {
    // backgroundColor: 'red',
    alignItems: 'center',
    marginVertical: 20,
  },
  settingsIcon: {
    position: 'absolute',
    right: 2,
  },
  avatar: {
    backgroundColor: 'gray',
    marginTop: 15,
  },
  name: {
    padding: 0,
    marginTop: 15,
    fontSize: 17,
    color: 'white',
  },
  headerTextButton: {marginTop: 0},
  debug: {
    borderWidth: 1,
    borderColor: 'red',
  },
  touchable: {
    padding: 0,
    margin: 0,
    borderRadius: 1,
  },
  text: {
    padding: 0,
    margin: 0,
    fontSize: 17,
    color: 'white',
  },
  middleContainerIcons: {
    margin: 0,
  },
});
