/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect } from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainScreen from '../screens/MainScreen';
import HomeStack from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import { getToken, NotificationListener, requestUserPermission, setToken } from '../utils/pushnotification';
import { UserContext } from '../contexts/UserContext';
import {FIREBASE_AUTH} from '../../firebase';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();
function AppStack(): React.JSX.Element {
  const currentUser = useContext(UserContext);
  useEffect(() => {
    if (Platform.OS == "android") {
      requestUserPermission();
      NotificationListener();
      getToken();
      setToken(currentUser);
    }
  }, [])
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
