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
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();
const CustomTabButton = ({children, onPress}:{children:any, onPress?:any}) => (
  <TouchableOpacity
    style = {{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center'
    }}
    onPress={onPress}
  >
    <View style={{
      width: 70,
      height:70,
      borderRadius: 35,
      backgroundColor: 'transparent'
    }}>
      {children}

    </View>

  </TouchableOpacity>
);

function AppStack(): React.JSX.Element {
  const currentUser = useContext(UserContext);
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
    getToken();
    setToken(currentUser);
  }, [])
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            // height: 70,
            bottom: 10,
            left: 20,
            right: 20,
            backgroundColor: "transparent",
            borderRadius: 15,
            opacity: 1,
            elevation: 27,
            borderColor: "transparent"

          },
          // tabBarActiveBackgroundColor: "lightgreen",
          tabBarItemStyle: {
            borderRadius: 15
          }

        }}
        
        >
        <Tab.Screen name="Home" component={HomeStack} options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={require('../assets/icons/noun-homeCrop.png')}
                resizeMode='contain'
                style={{
                  width:35,
                  height:35,
                  tintColor: focused ? '#FF16B4' : "#FFFFFF"
                  
                }}
              />
            </View>
          ),
        }} />


        <Tab.Screen name="Camera" component={CameraScreen} 
          options={{
            tabBarIcon: ({focused}) => (
              <View>
              <Image
                source={require('../assets/icons/crosshair.png')}
                resizeMode='contain'
                style = {{
                  width:85,
                  height:85,
                  tintColor: 'white',
                }}

              />
              </View>
            ),
            tabBarButton: (props) => (
              <CustomTabButton {...props} />
            )
            


          }}
        />


        <Tab.Screen name="Profile" component={ProfileStackScreen} options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                source={require('../assets/icons/noun-profileCrop.png')}
                resizeMode='contain'
                style={{
                  width:35,
                  height:35,
                  tintColor: focused ? '#F1A533' : "#FFFFFF"
                  
                }}
              />
            </View>
          ),
        }}
        
        
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
