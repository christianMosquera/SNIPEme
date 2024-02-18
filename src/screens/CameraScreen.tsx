import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus} from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Button } from 'react-native-paper';

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

  // Handle flash
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off')
  function cycleFlash() {
    if (flash === 'off') {
      setFlash('auto')
    } else if (flash === 'auto') {
      setFlash('on')
    } else {
      setFlash('off')
    }
  }

  // Handle camera
  const [cameraDirection, setCameraDirection] = useState<'front' | 'back'>('back')
  const device = useCameraDevice(cameraDirection);
  const camera = useRef<Camera>(null)
  async function takePhoto() {
    const photo = await camera.current?.takePhoto({
      flash: device?.hasFlash ? flash : 'off',
    })
    console.log(photo)
  }

  if (hasPermission) {
    if (!device) {
      return <Text>Loading...</Text>;
    }
    return (
      <View style={StyleSheet.absoluteFill}>
        <Camera
          ref={camera}
          photo={true}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
        />
        <Button onPress={takePhoto} style={{position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'black'}}>
          <Text style={{color: 'white'}}>Take Photo</Text>
        </Button>
        <Button onPress={cycleFlash} style={{position: 'absolute', top: 20, left: 20, alignSelf: 'flex-start', backgroundColor: 'black'}}>
          <Text style={{color: 'white'}}>Flash ( {flash} )</Text>
        </Button>
        <Button onPress={() => setCameraDirection(cameraDirection === 'back' ? 'front' : 'back')} style={{position: 'absolute', top: 20, right: 20, alignSelf: 'flex-end', backgroundColor: 'black'}}>
          <Text style={{color: 'white'}}>Flip</Text>
        </Button>
        <Text style={{position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: 'black', color: 'white', fontSize: 20}}>SNIPEme</Text>
      </View>
    );
  } else {
    return <Text>No access to camera. Go to your settings to provide access.</Text>;
  }
}

export default CameraScreen;
