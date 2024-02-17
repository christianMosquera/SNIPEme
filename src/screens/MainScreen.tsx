import React from 'react';
import {View, Text, Alert, Button, StyleSheet} from 'react-native';
import {FIREBASE_AUTH} from '../../firebase';
import {FirebaseError} from 'firebase/app';
import {signOut} from 'firebase/auth';

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
    <View style={styles.view}>
      <Text>Hello, World!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default MainScreen;
