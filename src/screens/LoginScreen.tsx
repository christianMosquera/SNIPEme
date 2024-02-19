// LoginScreen.js

import React, {useState} from 'react';
import {View, TextInput, Button, Text, Alert, StyleSheet} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {FirebaseError} from 'firebase/app';
import {FIREBASE_AUTH} from '../../firebase';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../types/StackParamList';
import {COLORS} from '../assets/Colors';
import CustomButton from '../components/CustomButton';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = FIREBASE_AUTH;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logging in with:', email, password);
    } catch (error: unknown) {
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

  const handleSignUpScreen = () => {
    navigation.pop(1);
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          autoCapitalize="none"
          style={styles.textInput}
          secureTextEntry
        />
      </View>
      <CustomButton title="Login" onPress={handleLogin} disabled={false} />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Don't have an account?</Text>
        <Button title="Sign up" onPress={handleSignUpScreen} />
      </View>
    </View>
    // <View>
    //   <TextInput
    //     placeholder="Email"
    //     value={email}
    //     onChangeText={setEmail}
    //     keyboardType="email-address"
    //     autoCapitalize="none"
    //   />
    //   <TextInput
    //     placeholder="Password"
    //     value={password}
    //     onChangeText={setPassword}
    //     secureTextEntry
    //   />
    //   <Button title="Login" onPress={handleLogin} />
    //   <Text
    //     onPress={() => {
    //       navigation.navigate('SignUp');
    //     }}>
    //     Create an account
    //   </Text>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: COLORS.white,
    position: 'absolute',
    top: '23%',
    left: '10%',
    fontSize: 35,
    fontWeight: '700',
  },
  textInput: {
    width: '80%',
    height: 45,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: COLORS.white,
    backgroundColor: COLORS.TEXTINPUTBACK,
  },
  invalidInput: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  button: {
    width: '80%',
    height: 40,
    borderRadius: 5,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
  },
  loginText: {
    fontSize: 18,
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.red,
    position: 'absolute',
    left: '10%',
    bottom: 2,
  },
});

export default LoginScreen;
