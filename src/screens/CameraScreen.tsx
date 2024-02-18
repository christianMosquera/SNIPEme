import React, { useEffect } from 'react';
import {Text, StyleSheet } from 'react-native';
import { Camera, useCameraPermission } from 'react-native-vision-camera'

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission()

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (hasPermission) {
    const device = Camera.getAvailableCameraDevices()[1];
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    );
  } else {
    return <Text>No access to camera. Go to your settings to provide access.</Text>;
  }
}

export default CameraScreen;
