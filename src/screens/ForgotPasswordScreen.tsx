import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import {StackParamList} from '../types/StackParamList';
import {FIREBASE_AUTH} from '../../firebase';
import {sendPasswordResetEmail} from 'firebase/auth';
import {FirebaseError} from 'firebase/app';
import {COLORS} from '../assets/Colors';
import CustomButton from '../components/CustomButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    if (email && validEmail) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [email, validEmail]);

  const handleResetPassword = () => {
    try {
      const auth = FIREBASE_AUTH;
      sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Password Reset Email Sent',
        'Check email for instructions to reset password',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Sign in failed', 'Email/Password are incorrect');
            break;
        }
      }
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setValidEmail(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Forgot Password</Text>
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
      <CustomButton
        title="Reset Password"
        onPress={handleResetPassword}
        disabled={!showReset}
      />
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
});

export default ForgotPasswordScreen;
