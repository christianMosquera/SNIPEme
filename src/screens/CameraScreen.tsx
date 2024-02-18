import { useIsFocused } from '@react-navigation/native';
import {AppState, AppStateStatus} from 'react-native'
import React, { useEffect, useState } from 'react';
import {Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'

const CameraScreen = () => {
  // Handle app state
  const [appState, setAppState] = useState(AppState.currentState)
  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      setAppState(newState)
    }

    const subscription = AppState.addEventListener('change', onChange)

    return () => {
      subscription.remove()
    }
  }, [])

  // Handle camera active status
  const isFocused = useIsFocused()
  const isActive = isFocused && appState === 'active'

  // Handle camera permission
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (hasPermission) {
    const device = useCameraDevice('front');
    if (!device) {
      return <Text>Loading...</Text>;
    }
    console.log(device.position);
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
      />
    );
  } else {
    return <Text>No access to camera. Go to your settings to provide access.</Text>;
  }
}

export default CameraScreen;
