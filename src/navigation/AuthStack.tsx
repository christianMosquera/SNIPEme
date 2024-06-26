/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import {StackParamList} from '../types/StackParamList';
import PasswordScreen from '../screens/PasswordScreen';
import ArrowHeader from '../components/ArrowHeader';
import ZipCodeScreen from '../screens/ZipCodeScreen';

const Stack = createNativeStackNavigator<StackParamList>();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerLeft: () => <ArrowHeader />,
        }}
        initialRouteName="Welcome">
        <Stack.Screen
          name="Login"
          options={{
            headerTitle: '',
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{
            headerTitle: '',
          }}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="Welcome"
          options={{headerShown: false}}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Password"
          options={{
            headerTitle: '',
          }}
          component={PasswordScreen}
        />
        <Stack.Screen
          name="Reset"
          options={{
            headerTitle: '',
          }}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="ZipCode"
          options={{
            headerTitle: '',
          }}
          component={ZipCodeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
