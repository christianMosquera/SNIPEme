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
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../types/StackParamList';
import {COLORS} from '../assets/Colors';
import CustomButton from '../components/CustomButton';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ZipCodeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [zipCode, setZipCode] = useState('');
  const route = useRoute<RouteProp<StackParamList>>();
  const email = route.params?.email;
  const username = route.params?.username;
  const name = route.params?.name;

  const handleZipCodeChange = (value: string) => {
    setZipCode(value);
  };

  const handleSubmit = () => {
    // Check if zip code is valid (add your validation logic here)
    if (!zipCode.trim()) {
      Alert.alert('Invalid Zip Code', 'Please enter a valid zip code');
      return;
    }

    // Navigate to the password screen passing necessary data
    if (email && username && name)
      navigation.navigate('Password', {
        email: email,
        username: username,
        name: name,
        zipcode: zipCode,
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Enter Zip Code</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.PLACEHOLDER}
          placeholder="Zip Code"
          value={zipCode}
          onChangeText={handleZipCodeChange}
          keyboardType="number-pad"
        />
        <CustomButton title="Next" onPress={handleSubmit} disabled={false} />
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
  text: {
    color: COLORS.white,
    position: 'absolute',
    top: '23%',
    left: '10%',
    fontSize: 35,
    fontWeight: '700',
  },
});

export default ZipCodeScreen;
