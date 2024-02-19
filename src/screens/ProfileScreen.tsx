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

// const ProfileScreen = () => {
//     //   // Dummy data for example purposes
//     //   const profileData = {
//     //     username: 'tidbutt',
//     //     name: 'Tidbit',
//     //     profilePictureUri: 'https://example.com/profile.jpg',
//     //     streakCount: 5,
//     //     friendsCount: 100,
//     //   };

//     return (
//       <View>
//         {/* <ProfileHeader
//           {...profileData}
//           onStreakPress={() => {}}
//           onFriendsPress={() => {}}
//         /> */}
//         <ProfileHeader></ProfileHeader>
//       </View>
//     );
//   };
