// ProfileScreen.tsx
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileFeed from '../components/ProfileFeed';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <ProfileHeader></ProfileHeader>
      <ProfileFeed></ProfileFeed>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
});
