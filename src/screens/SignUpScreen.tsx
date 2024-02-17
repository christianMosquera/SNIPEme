import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {FIREBASE_AUTH} from '../../firebase';
import {createUserWithEmailAndPassword} from '@firebase/auth';
import storeUserInFirestore from '../utils/StoreUser';
import {FirebaseError} from 'firebase/app';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const auth = FIREBASE_AUTH;
    try {
      // create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // store user data in firestore
      if (userCredential.user) {
        await storeUserInFirestore(
          userCredential.user,
          username,
          firstName,
          lastName,
        );
      }

      //navigation.navigate('EmailVerification');
    } catch (error) {
      if (error instanceof FirebaseError) {
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
    }
  };

  return (
    <View>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        keyboardType="default"
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        keyboardType="default"
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        autoCapitalize="none"
      />
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
