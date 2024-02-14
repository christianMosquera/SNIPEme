// LoginScreen.js

import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {FIREBASE_AUTH} from '../../firebase';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = FIREBASE_AUTH;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logging in with:', email, password);
    } catch (error) {
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
      console.error('Error signing up:', error);
    }
  };

  return (
    <View>
      <Text>Login</Text>
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
      <Text onPress={() => navigation.navigate('SignUp' as never)}>
        Create an account
      </Text>
    </View>
  );
};

export default LoginScreen;
