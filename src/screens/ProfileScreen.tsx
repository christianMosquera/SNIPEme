// ProfileScreen.tsx
import React, {useMemo} from 'react';
import {SafeAreaView, StyleSheet, View, ActivityIndicator} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileFeed from '../components/ProfileFeed';
import useUserData from '../utils/useUserData';

const ProfileScreen = () => {
  const fieldsToFetch = useMemo(
    () => [
      'name',
      'avatar_url',
      'username',
      'streak',
      'friendsCount',
      'isSnipingEnabled',
    ],
    [],
  );

  const {userData, loading} = useUserData(fieldsToFetch);

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
          avatarUrl={userData.avatar_url ?? null}
          username={userData.username}
          name={userData.name}
          streak={userData.streak}
          friendsCount={userData.friendsCount}
          isSnipingEnabled={userData.isSnipingEnabled} // Pass isSnipingEnabled to ProfileHeader
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
