// ProfileHeader.tsx

import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Avatar, Button, IconButton, Switch} from 'react-native-paper';

type Props = {};
const isDebugMode = false;

const ProfileHeader = (props: Props) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topContainer}>
        {/* <Button
          mode="text"
          textColor="white"
          onPress={() => console.log('Username Text Button Pressed')}>
          Username
        </Button> */}
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
          onPress={() => console.log('Settings Icon Pressed')}
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
          {/* <Button
            style={[styles.headerTextButton, isDebugMode && styles.debug]}
            mode="text"
            textColor="white"
            onPress={() => console.log('Streak Number Text Button Pressed')}>
            32
          </Button> */}
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
          {/* <Button
            style={[styles.headerTextButton, isDebugMode && styles.debug]}
            mode="text"
            textColor="white"
            onPress={() => console.log('Streak Text Button Pressed')}>
            Streak
          </Button> */}
        </View>
        <View style={styles.nameContainer}>
          <Avatar.Icon
            style={styles.avatar}
            size={110}
            color="white"
            icon="account"
          />
          {/* <Button
            mode="text"
            textColor="white"
            onPress={() => console.log('Name Text Button Pressed')}>
            Name
          </Button> */}
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
            onPress={() => console.log('Friends Icon Pressed')}
          />
          {/* <Button
            style={[styles.headerTextButton, isDebugMode && styles.debug]}
            mode="text"
            textColor="white"
            onPress={() => console.log('Friends Number Text Button Pressed')}>
            46
          </Button>
          <Button
            mode="text"
            textColor="white"
            onPress={() => console.log('Friends Text Button Pressed')}>
            Friends
          </Button> */}
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
    // flex: 0.4,

    // alignItems: 'center',
  },
  topContainer: {
    // backgroundColor: 'magenta',
    // flex: 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'stretch',
    position: 'relative',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  middleContainer: {
    // backgroundColor: 'purple',
    // flex: 0.3,
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
    // flex: 0.1,
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
    // fontWeight: 'bold',
  },
  middleContainerIcons: {
    margin: 0,
  },
});
