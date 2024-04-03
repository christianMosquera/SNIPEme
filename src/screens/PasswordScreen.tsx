import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import {StackParamList} from '../types/StackParamList';
import storeUserInFirestore from '../utils/StoreUser';
import {FIREBASE_AUTH} from '../../firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {FirebaseError} from 'firebase/app';
import {COLORS} from '../assets/Colors';
import CustomButton from '../components/CustomButton';
import {Checkbox} from 'react-native-paper';

const PasswordScreen = () => {
  const route = useRoute<RouteProp<StackParamList>>();
  const email = route.params?.email;
  const username = route.params?.username;
  const name = route.params?.name;
  const zipcode = route.params?.zipcode;
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [agreeError, setAgreeError] = useState('');
  const [checked, setChecked] = React.useState(false);

  const handleSignUp = async () => {
    const auth = FIREBASE_AUTH;
    try {
      // create user with email and password
      if (email && username && name && zipcode) {
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
            name,
            zipcode,
          );
        }
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
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleCheckboxChange = () => {
    setAgree(!agree);
  };

  const handleSubmit = () => {
    setPasswordError('');
    setAgreeError('');

    // Validate password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    // Add more password validation logic here (e.g., check for uppercase, lowercase, special characters)

    // Validate checkbox
    if (!agree) {
      setAgreeError('You must agree to the terms and conditions');
      return;
    }

    // Submit form if password is valid and checkbox is checked
    // Add your submit logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Create Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.PLACEHOLDER}
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
            color="white"
            uncheckedColor="white"
          />
          <Text style={styles.checkboxLabel}>
            Agree to terms and conditions
          </Text>
        </View>
        {agreeError ? <Text style={styles.errorText}>{agreeError}</Text> : null}
        <CustomButton title="Sign Up" onPress={handleSignUp} disabled={false} />
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
  input: {
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: COLORS.white,
  },
  errorText: {
    color: COLORS.red,
    position: 'absolute',
    left: '10%',
    bottom: 2,
  },
  text: {
    color: COLORS.white,
    position: 'absolute',
    top: '23%',
    left: '10%',
    fontSize: 35,
    fontWeight: '700',
  },
});

export default PasswordScreen;
