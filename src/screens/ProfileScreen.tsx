import React, {useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileFeed from '../components/ProfileFeed';
import getUserData from '../utils/getUserData';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ProfileStackParamList} from '../types/ProfileStackParamList';

const ProfileScreen = () => {
  const route = useRoute<RouteProp<ProfileStackParamList>>();
  const user_id = route.params?.user_id;
  const fieldsToFetch = useMemo(
    () => ['name', 'avatar_url', 'username', 'streak', 'friendsCount'],
    [],
  );
  if (!user_id) {
    return (
      <SafeAreaView>
        <Text>User ID is undefined</Text>
      </SafeAreaView>
    );
  }
  const {userData, loading} = getUserData(user_id, fieldsToFetch);

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
          user_id={user_id}
        />
      )}
      <ProfileFeed user_id={user_id} />
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
