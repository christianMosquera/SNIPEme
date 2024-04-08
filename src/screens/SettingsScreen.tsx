import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {FIREBASE_AUTH} from '../../firebase';
import {FirebaseError} from 'firebase/app';
import {signOut} from 'firebase/auth';
import updateZipCode from '../utils/updateZipCode';
import {COLORS} from '../assets/Colors';

const SettingsScreen = () => {
  const [newZipCode, setNewZipCode] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      Alert.alert('Sign Out', 'You have been successfully signed out.');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Error signing out:', error.message);
        Alert.alert('Error', 'Failed to sign out. Please try again later.');
      }
    }
  };

  const handleUpdateZipCode = async () => {
    try {
      if (FIREBASE_AUTH.currentUser) {
        await updateZipCode(FIREBASE_AUTH.currentUser.uid, newZipCode);
        Alert.alert('Success', 'Zip code updated successfully.');
        setNewZipCode('');
      }
    } catch (error) {
      console.error('Error updating zip code:', error);
      Alert.alert(
        'Error',
        'Failed to update zip code. Please try again later.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Update Zip Code</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new zip code"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={newZipCode}
          onChangeText={setNewZipCode}
          keyboardType="number-pad"
        />
      </View>
      <Button title="Update Zip Code" onPress={handleUpdateZipCode} />
      <Button title="Sign Out" onPress={handleSignOut} />
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
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: COLORS.white,
    backgroundColor: COLORS.TEXTINPUTBACK,
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SettingsScreen;
