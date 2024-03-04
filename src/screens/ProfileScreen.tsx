// ProfileScreen.tsx
import React, {useMemo} from 'react';
import {StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileFeed from '../components/ProfileFeed';
import getUserData from '../utils/getUserData';

const ProfileScreen = () => {
  const fieldsToFetch = useMemo(
    () => ['name', 'avatar_url', 'username', 'streak', 'friendsCount'],
    [],
  );
  const {userData, loading} = getUserData(fieldsToFetch);

  React.useEffect(() => {
    console.log('User data on profile page load/update:', userData);
  }, [userData]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      {userData && (
        <ProfileHeader
          avatarUrl={userData.avatar_url}
          username={userData.username}
          name={userData.name}
          streak={userData.streak}
          friendsCount={userData.friendsCount}
        />
      )}
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
