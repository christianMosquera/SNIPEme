import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../types/StackParamList';
import checkUsernameValid from '../utils/CheckUsernameValid';
import {COLORS} from '../assets/Colors';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validUsername, setValidUsername] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  useEffect(() => {
    if (fullName && email && username && validUsername && validEmail) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  }, [fullName, email, username, validUsername, validEmail]);

  const handleScreenChange = async () => {
    navigation.navigate('ZipCode', {
      name: fullName,
      username: username,
      email: email,
      zipcode: '',
    });
  };

  const handleNameChange = (text: string) => {
    setFullName(text);
    setValidName(text.trim() !== '');
  };

  const handleUsernameChange = async (text: string) => {
    setUsername(text);
    setValidUsername(await checkUsernameValid(text));
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setValidEmail(/\S+@\S+\.\S+/.test(text));
  };

  const handleLoginScreen = () => {
    navigation.pop(1);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={fullName}
          onChangeText={handleNameChange}
          keyboardType="default"
          autoCapitalize="words"
          style={[styles.textInput, !validName && styles.invalidInput]}
        />
        {validName ? null : (
          <Text style={styles.errorText}>Must input a name</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={username}
          onChangeText={handleUsernameChange}
          keyboardType="default"
          autoCapitalize="none"
          style={[styles.textInput, !validUsername && styles.invalidInput]}
        />
        {validUsername ? null : (
          <Text style={styles.errorText}>Username in use</Text>
        )}
      </View>
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
        {validEmail ? null : (
          <Text style={styles.errorText}>Invalid email</Text>
        )}
      </View>
      <CustomButton
        title="Next"
        onPress={handleScreenChange}
        disabled={!showNext}
      />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Button title="Login" onPress={handleLoginScreen} />
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

export default SignUpScreen;
