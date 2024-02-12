import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {FIREBASE_AUTH} from '../../firebase';
import {createUserWithEmailAndPassword} from '@firebase/auth';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const auth = FIREBASE_AUTH;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // User signed up successfully
      console.log('User signed up successfully');
    } catch (error) {
      console.error(error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Sign up failed', 'Email already in use');
          break;
        case 'auth/invalid-email':
          Alert.alert('Sign up failed', 'Invalid email address');
          break;
        case 'auth/weak-password':
          Alert.alert(
            'Sign up failed',
            'Password must contain at least 6 characters',
          );
          break;
        case 'auth/missing-email':
          Alert.alert('Sign up failed', 'Please provide an email address');
          break;
        case 'auth/missing-password':
          Alert.alert('Sign up failed', 'Please provide a password');
          break;
      }
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
