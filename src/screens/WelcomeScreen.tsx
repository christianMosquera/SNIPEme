import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {COLORS} from '../assets/Colors';
import {useNavigation} from '@react-navigation/native';
import {StackParamList} from '../types/StackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  return (
    <View style={styles.container}>
      <Text style={styles.SNIPEme}>SNIPEme</Text>
      <Button
        style={styles.signIn}
        mode="elevated"
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Sign In</Text>
      </Button>
      <Button
        style={styles.signUp}
        mode="outlined"
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  SNIPEme: {
    color: COLORS.white,
    fontSize: 60,
    fontWeight: '700',
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 100,
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  signIn: {
    bottom: 170,
    left: 0,
    marginLeft: 40,
    marginRight: 40,
    position: 'absolute',
    right: 0,
  },
  signInText: {
    color: COLORS.black,
  },
  signUp: {
    bottom: 100,
    left: 0,
    marginLeft: 40,
    marginRight: 40,
    position: 'absolute',
    right: 0,
  },
  signUpText: {
    color: COLORS.white,
  },
});

export default WelcomeScreen;
