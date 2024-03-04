import React from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {FIREBASE_AUTH} from '../../firebase';
import {FirebaseError} from 'firebase/app';
import {signOut} from 'firebase/auth';
import {COLORS} from '../assets/Colors';

const MainScreen = () => {
  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH); // Sign out the current user
      Alert.alert('Sign Out', 'You have been successfully signed out.');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Error signing out:', error.message);
        Alert.alert('Error', 'Failed to sign out. Please try again later.');
      }
    }
  };
  return (
    <SafeAreaView style={styles.view}>
      <Text style={styles.text}>Hello, World!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  text: {
    color: COLORS.white,
  },
});

export default MainScreen;
