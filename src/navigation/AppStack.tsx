/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useContext, useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import CameraScreen from '../screens/CameraScreen';
import HomeStack from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import {
  getToken,
  NotificationListener,
  requestUserPermission,
  setToken,
} from '../utils/pushnotification';
import {UserContext} from '../contexts/UserContext';
import {View, Image} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import {FIREBASE_AUTH} from '../../firebase';
import { Platform } from 'react-native';
import FlashMessage from "react-native-flash-message";
import { getFcmToken, registerListenerWithFCM } from '../utils/pushnotificationios';

export const NotifContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

function AppStack(): React.JSX.Element {
  const currentUser = useContext(UserContext);
  const [newNotification, setNewNotification] = useState(false);
  useEffect(() => {
    if (Platform.OS == 'android') {
      requestUserPermission();
      NotificationListener();
      getToken();
      setToken(currentUser);
    } else {
      if (currentUser == null) return;
      getFcmToken(currentUser);
    }
  }, [currentUser])
  useEffect(() => {
    if (Platform.OS == "ios") {
      const unsubscribe = registerListenerWithFCM();
      return unsubscribe;
    }
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            backgroundColor: 'transparent',
            opacity: 1,
            elevation: 27,
            borderTopWidth: 0
          },
          tabBarItemStyle: {
            borderRadius: 15,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Image
                  source={require('../assets/icons/noun-homeCrop.png')}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? '#FF16B4' : '#FFFFFF',
                    justifyContent: 'center',
                  }}
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Image
                  source={require('../assets/icons/crosshair.png')}
                  resizeMode="contain"
                  style={{
                    width: 55,
                    height: 55,
                    tintColor: focused ? '#FF16B4' : '#FFFFFF',
                    top: -15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View>
                <Image
                  source={require('../assets/icons/noun-profileCrop.png')}
                  resizeMode="contain"
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: focused ? '#FF16B4' : '#FFFFFF',
                  }}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

export default AppStack;
