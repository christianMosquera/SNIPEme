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

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
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
        name="Main"
        options={{headerShown: false}}
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
