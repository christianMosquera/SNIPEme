import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Button } from 'react-native-paper';
import { ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { GlobalContext } from '../contexts/GlobalContext';
import { GlobalContextType } from '../types/GlobalContextType';

const CameraScreen = () => {
  const globalContext = useContext(GlobalContext) as unknown as GlobalContextType;
  const currentUser = globalContext.authData;

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
  const [photoPath, setPhotoPath] = useState<string | null>(null)
  async function takePhoto() {
    const photo = await camera.current?.takePhoto({
      flash: device?.hasFlash ? flash : 'off',
    })
    setPhotoPath(photo?.path ?? null)
  }

  // Handle target
  const currentTarget = globalContext.userData?.currentTarget;

  // Handle posting
  async function postPhoto() {
    if (!photoPath || !currentUser || !currentTarget) {
      console.log('Failed to post: No photo or user not loaded');
      return;
    }

    // Check if there was already a post today
    const today = new Date();
    const date = today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
    const q = doc(FIREBASE_STORE, "Posts", currentUser.uid + date);
    const snapshot = await getDoc(q);
    if (snapshot.exists()) {
      console.log('Already posted today');
      setPhotoPath(null);
      return;
    }

    const storageRef = ref(FIREBASE_STORAGE, 'snipes/' + currentUser.uid + '/' + date + '.jpg');
    
    // Read file data from path
    const blob = await fetch('file://' + photoPath).then( response => {
      return response.blob();
    }, error => {
      console.log(error); 
    });

    if (blob == null) {
      console.log("Failed to read file data from path");
      return;
    }

    // Upload file data
    const filePath = "gs://snipeme-22003.appspot.com/" + await uploadBytes(storageRef, blob).then((snapshot) => {
      return snapshot.metadata.fullPath;
    })

    if (!filePath) {
      console.log('Failed to upload file');
      return;
    }

    // Create a new snipe in the database
    const snipeRef = doc(FIREBASE_STORE, "Posts", currentUser.uid + date);
    const snipeData = {
      approved: false,
      sniper_id: currentUser.uid,
      target_id: currentTarget,
      image: filePath,
      timestamp: new Date()
    };
    await setDoc(snipeRef, snipeData).then(() => {
      console.log('Snipe added to database: ' + filePath);
    }, error => {
      console.error('Error adding snipe to database', error);
    })

    setPhotoPath(null);
  }

  if (hasPermission) {
    if (photoPath) {
      return (<View style={StyleSheet.absoluteFill}>
        <Image style={StyleSheet.absoluteFill} src={'file://' + photoPath} alt="captured photo" />
        <Button onPress={() => setPhotoPath(null)} style={{position: 'absolute', bottom: 20, left: 50, alignSelf: 'flex-start', backgroundColor: 'white'}}>
          <Text style={{color: 'black'}}>Retake</Text>
        </Button>
        <Button onPress={postPhoto} style={{position: 'absolute', bottom: 20, right: 50, alignSelf: 'flex-end', backgroundColor: 'black'}}>
          <Text style={{color: 'white'}}>Post!</Text>
        </Button>
      </View>)
    }
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
