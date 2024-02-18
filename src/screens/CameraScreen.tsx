import React, { useEffect } from 'react';
import {Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Camera } from 'react-native-vision-camera'

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
        if (cameraPermission === RESULTS.DENIED) {
          const result = await request(PERMISSIONS.IOS.CAMERA);
          setHasPermission(result === RESULTS.GRANTED);
        } else {
          setHasPermission(cameraPermission === RESULTS.GRANTED);
        }
      } else {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "Your app needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        setHasPermission(result === PermissionsAndroid.RESULTS.GRANTED);
      }
    })();
  }, []);

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
    return <Text>No access to camera</Text>;
  }
}

export default CameraScreen;
