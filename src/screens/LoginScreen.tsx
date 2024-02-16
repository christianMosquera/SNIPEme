// LoginScreen.js

import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {FirebaseError} from 'firebase/app';
import {FIREBASE_AUTH} from '../../firebase';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../types/StackParamList';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = FIREBASE_AUTH;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logging in with:', email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            Alert.alert('Sign in failed', 'Email/Password are incorrect');
            break;
          case 'auth/missing-email':
            Alert.alert('Sign up failed', 'Please provide an email address');
            break;
          case 'auth/missing-password':
            Alert.alert('Sign up failed', 'Please provide a password');
            break;
          case 'auth/too-many-requests':
            Alert.alert(
              'Sign in failed',
              'Access has been temporarily disabled, reset password or try again later',
            );
            break;
        }
      }
      console.error('Error signing up:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        onPress={() => {
          navigation.navigate('SignUp');
        }}>
        Create an account
      </Text>
    </View>
  );
};

export default LoginScreen;
