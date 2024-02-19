// ProfileScreen.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileFeed from '../components/ProfileFeed';

const ProfileScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <ProfileHeader></ProfileHeader>
      <ProfileFeed></ProfileFeed>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'black', // Assuming you want a white background for the whole screen
    // Add padding or margins as needed
  },
});
