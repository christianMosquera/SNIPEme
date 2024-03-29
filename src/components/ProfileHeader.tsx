// ProfileHeader.tsx

import React from 'react';
import {StyleSheet, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {Text, Avatar, IconButton, Switch} from 'react-native-paper';
import {ProfileStackParamList} from '../types/ProfileStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import {doc, updateDoc} from 'firebase/firestore';
import {FIREBASE_STORE, FIREBASE_AUTH} from '../../firebase';
import {useCurrentUser} from '../contexts/UserContext';


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
  const currentUser = useCurrentUser();

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
    } catch (error) {
      console.error('Error updating sniping status:', error);
    }
  };

  const onToggleSwitch = () => {
    const newSwitchValue = !isSwitchOn;
    setIsSwitchOn(newSwitchValue);
    updateUserSnipingStatus(newSwitchValue);
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => console.log('Username Text Button Pressed')}>
          <Text style={styles.text} variant="titleMedium">
            {username}
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
        <View style={styles.streakContainer}>
          <IconButton
            style={styles.middleContainerIcons}
            icon="fire"
            iconColor="white"
            size={100}
            onPress={() => console.log('Streak Icon Pressed')}
          />
          {typeof streak === 'number' && (
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => console.log('Streak Number Text Button Pressed')}>
              <Text style={styles.text} variant="titleMedium">
                {streak}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Streak Text Button Pressed')}>
            <Text style={styles.text} variant="titleMedium">
              Streak
            </Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.friendsContainer}>
          <IconButton
            style={styles.middleContainerIcons}
            icon="target-account"
            iconColor="white"
            size={100}
            onPress={() => navigation.push('Friends', {user_id: user_id})}
          />
          {typeof friendsCount === 'number' && (
            <TouchableOpacity
              style={styles.touchable}
              onPress={() => console.log('Friends Number Text Button Pressed')}>
              <Text style={styles.text} variant="titleMedium">
                {friendsCount}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Friends Text Button Pressed')}>
            <Text style={styles.text} variant="titleMedium">
              Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.snipingStatusContainer}>
        <Text style={styles.text} variant="labelLarge">
          Sniping Status
        </Text>
        <Switch color="red" value={isSwitchOn} onValueChange={onToggleSwitch} />
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
    marginTop: 4,
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
    // textAlign: 'center',
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
