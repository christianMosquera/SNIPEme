import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ArrowHeader from '../components/ArrowHeader';
import {COLORS} from '../assets/Colors';
import SettingsScreen from '../screens/SettingsScreen';
import PlusHeader from '../components/PlusHeader';
import AddFriendScreen from '../screens/AddFriendScreen';

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTransparent: true,
      }}>
      <ProfileStack.Screen
        options={{
          headerTitle: '',
        }}
        name="Profile"
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name="Friends"
        options={{
          headerTransparent: true,
          headerLeft: () => <ArrowHeader />,
          headerRight: () => <PlusHeader />,
          headerTitle: 'Friends',
          headerTintColor: COLORS.white,
        }}
        component={FriendsScreen}
      />
      <ProfileStack.Screen
        name="Settings"
        options={{
          headerTransparent: true,
          headerLeft: () => <ArrowHeader />,
          headerTitle: 'Settings',
          headerTintColor: COLORS.white,
        }}
        component={SettingsScreen}
      />
      <ProfileStack.Screen
        name="AddFriend"
        options={{
          headerTransparent: true,
          headerLeft: () => <ArrowHeader />,
          headerTitle: 'Add a Friend',
          headerTintColor: COLORS.white,
        }}
        component={AddFriendScreen}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
