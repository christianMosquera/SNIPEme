/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackParamList} from '../types/StackParamList';
import PostDetail from '../components/PostDetail';
import ArrowHeader from '../components/ArrowHeader';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<StackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
    screenOptions={{
        headerTransparent: true,
        headerLeft: () => <ArrowHeader />,
    }}
    initialRouteName="Home">
    <Stack.Screen
        name='Detail'
        options={{
        headerTitle: '',
        }}
        component={PostDetail}
    />
    <Stack.Screen
        name='Home'
        options={{headerShown: false}}
        component={HomeScreen}
    />
    </Stack.Navigator>
  );
};

export default HomeStack;
