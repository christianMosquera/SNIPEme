import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled: boolean;
}

const CustomButton = ({title, onPress, disabled}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={disabled ? styles.disabledText : styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#0056b3',
  },
  disabledText: {
    color: '#b0b0b0',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default CustomButton;
