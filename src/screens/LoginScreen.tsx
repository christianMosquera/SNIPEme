import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
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
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (email && password && validPassword && validEmail) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [email, password, validEmail, validPassword]);

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
            setValidEmail(false);
            setValidPassword(false);
            break;
          case 'auth/invalid-email':
            Alert.alert('Sign in failed', 'Email/Password are incorrect');
            setValidEmail(false);
            setValidPassword(false);
            break;
          case 'auth/missing-email':
            Alert.alert('Sign up failed', 'Please provide an email address');
            setValidEmail(false);
            setValidPassword(false);
            break;
          case 'auth/missing-password':
            Alert.alert('Sign up failed', 'Please provide a password');
            setValidEmail(false);
            setValidPassword(false);
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

  const handleForgotPassword = () => {
    navigation.navigate('Reset');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setValidEmail(true);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setValidPassword(true);
  };

  const handleSignUpScreen = () => {
    navigation.pop(1);
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="default"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.textInput, !validEmail && styles.invalidInput]}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={password}
          onChangeText={handlePasswordChange}
          keyboardType="default"
          autoCapitalize="none"
          style={[styles.textInput, !validPassword && styles.invalidInput]}
          secureTextEntry
        />
      </View>
      <View>
        <Button title="Forgot Password?" onPress={handleForgotPassword} />
      </View>
      <CustomButton title="Login" onPress={handleLogin} disabled={!showLogin} />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Don't have an account?</Text>
        <Button title="Sign up" onPress={handleSignUpScreen} />
      </View>
    </SafeAreaView>
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
