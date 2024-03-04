// ProfileHeader.tsx

import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Avatar, Button, IconButton, Switch} from 'react-native-paper';
import {ProfileStackParamList} from '../types/ProfileStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type Props = {};
const isDebugMode = false;

const ProfileHeader = (props: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => console.log('Username Text Button Pressed')}>
          <Text style={styles.text} variant="titleMedium">
            username
          </Text>
        </TouchableOpacity>
        <IconButton
          style={styles.settingsIcon}
          icon="cog"
          iconColor="white"
          size={30}
          onPress={() => navigation.navigate('Settings')}
        />
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
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Streak Number Text Button Pressed')}>
            <Text style={styles.text} variant="titleMedium">
              32
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Streak Text Button Pressed')}>
            <Text style={styles.text} variant="titleMedium">
              Streak
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nameContainer}>
          <Avatar.Icon
            style={styles.avatar}
            size={110}
            color="white"
            icon="account"
          />
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Name Text Button Pressed')}>
            <Text style={styles.name} variant="titleMedium">
              Name
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.friendsContainer}>
          <IconButton
            style={styles.middleContainerIcons}
            icon="target-account"
            iconColor="white"
            size={100}
            onPress={() => navigation.navigate('Friends')}
          />
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => console.log('Friends Number Text Button Pressed')}>
            <Text style={styles.text} variant="titleMedium">
              46
            </Text>
          </TouchableOpacity>
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
    </View>
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
