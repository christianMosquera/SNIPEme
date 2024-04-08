import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {FIREBASE_AUTH} from '../../firebase';
import {FirebaseError} from 'firebase/app';
import {signOut} from 'firebase/auth';
import updateZipCode from '../utils/updateZipCode';
import {COLORS} from '../assets/Colors';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {IconButton} from 'react-native-paper';

const SettingsScreen = () => {
  const [newZipCode, setNewZipCode] = useState('');

  const handleSignOut = async () => {
    try {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Sign out',
            onPress: async () => {
              await signOut(FIREBASE_AUTH);
              Alert.alert('Sign Out', 'You have been successfully signed out.');
            },
          },
        ],
        {cancelable: false},
      );
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
      <ScrollView style={styles.scroll}>
        <TouchableOpacity style={styles.settingsButton}>
          <View style={styles.leftContainer}>
            <IconButton icon={'chart-bar'} size={30} iconColor={COLORS.white} />
            <Text style={styles.text}>Activity</Text>
          </View>
          <View style={styles.rightContainer}>
            <IconButton
              icon={'chevron-right'}
              size={30}
              iconColor={COLORS.white}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <View style={styles.leftContainer}>
            <IconButton
              icon={'bell-circle-outline'}
              size={30}
              iconColor={COLORS.white}
            />
            <Text style={styles.text}>Notifications</Text>
          </View>
          <View style={styles.rightContainer}>
            <IconButton
              icon={'chevron-right'}
              size={30}
              iconColor={COLORS.white}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <View style={styles.leftContainer}>
            <IconButton
              icon={'account-circle-outline'}
              size={30}
              iconColor={COLORS.white}
            />
            <Text style={styles.text}>Account</Text>
          </View>
          <View style={styles.rightContainer}>
            <IconButton
              icon={'chevron-right'}
              size={30}
              iconColor={COLORS.white}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <View style={styles.leftContainer}>
            <IconButton
              icon={'help-circle-outline'}
              size={30}
              iconColor={COLORS.white}
            />
            <Text style={styles.text}>Help</Text>
          </View>
          <View style={styles.rightContainer}>
            <IconButton
              icon={'chevron-right'}
              size={30}
              iconColor={COLORS.white}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSignOut}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>Log out</Text>
          </View>
          <View style={styles.rightContainer}>
            <IconButton
              icon={'chevron-right'}
              size={30}
              iconColor={COLORS.white}
            />
          </View>
        </TouchableOpacity>

        {/* <Text style={styles.text}>Update Zip Code</Text>
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
        <Button title="Sign Out" onPress={handleSignOut} /> */}
      </ScrollView>
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
    marginBottom: 0,
    marginLeft: 10,
  },
  scroll: {
    width: '100%',
    marginTop: 50,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '95%',
    alignSelf: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Updated alignment
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Updated alignment
  },

  help: {
    color: COLORS.white,
  },
});

export default SettingsScreen;
