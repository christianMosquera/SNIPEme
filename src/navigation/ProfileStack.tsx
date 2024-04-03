import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ArrowHeader from '../components/ArrowHeader';
import {COLORS} from '../assets/Colors';
import SettingsScreen from '../screens/SettingsScreen';
import PlusHeader from '../components/PlusHeader';
import AddFriendScreen from '../screens/AddFriendScreen';
import {FIREBASE_AUTH} from '../../firebase';
import {useNavigationState} from '@react-navigation/native';

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  const currentUserID = FIREBASE_AUTH.currentUser?.uid;

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTransparent: true,
      }}>
      <ProfileStack.Screen
        options={() => ({
          headerTitle: '',
          headerLeft: () => {
            const index = useNavigationState(state => state.index);
            if (index === 0) {
              return null;
            }
            return <ArrowHeader />;
          },
        })}
        name="ProfileMain"
        component={ProfileScreen}
        initialParams={{user_id: currentUserID}}
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
