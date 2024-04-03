/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../types/HomeStackParamList';
import PostDetail from '../components/PostDetail';
import ArrowHeader from '../components/ArrowHeader';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {useNavigationState} from '@react-navigation/native';
import {FIREBASE_AUTH} from '../../firebase';
import FriendsScreen from '../screens/FriendsScreen';
import PlusHeader from '../components/PlusHeader';
import {COLORS} from '../assets/Colors';
import AddFriendScreen from '../screens/AddFriendScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  const currentUserID = FIREBASE_AUTH.currentUser?.uid;
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerLeft: () => <ArrowHeader />,
      }}
      initialRouteName="Main">
      <Stack.Screen
        name="Detail"
        options={{
          headerTitle: '',
        }}
        component={PostDetail}
      />
      <Stack.Screen
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
      <Stack.Screen
        name="AddFriend"
        options={{
          headerTransparent: true,
          headerLeft: () => <ArrowHeader />,
          headerTitle: 'Add a Friend',
          headerTintColor: COLORS.white,
        }}
        component={AddFriendScreen}
      />
      <Stack.Screen
        name="Main"
        options={{headerShown: false}}
        component={HomeScreen}
      />
      <Stack.Screen
        name="Notification"
        options={{
          headerTransparent: true,
          headerLeft: () => <ArrowHeader />,
          headerTitle: 'Notifications',
          headerTintColor: COLORS.white,
        }}
        component={NotificationsScreen}
      />
      <Stack.Screen
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
        name="ProfileHome"
        component={ProfileScreen}
        initialParams={{user_id: currentUserID}}
      />
      <Stack.Screen
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
    </Stack.Navigator>
  );
};

export default HomeStack;
