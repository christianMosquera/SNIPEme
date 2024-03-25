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
import ProfileScreen from '../screens/ProfileScreen';
import { useNavigationState } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebase';
import AddFriendScreen from '../screens/AddFriendScreen';
import { COLORS } from '../assets/Colors';

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
    </Stack.Navigator>
  );
};

export default HomeStack;
