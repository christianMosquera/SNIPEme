import React from 'react';
import {View, Text, Alert, Button, StyleSheet} from 'react-native';

const CameraScreen = () => {
  return (
    <View style={styles.view}>
      <Text>Camera!</Text>
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

export default CameraScreen;
