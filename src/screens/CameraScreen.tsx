import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  AppStateStatus,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {Avatar, Button, Icon, IconButton} from 'react-native-paper';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import {UserContext} from '../contexts/UserContext';
import {User} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {getUsername, sendNotification} from '../utils/pushnotification';
import useUserData from '../utils/useUserData';
import {SafeAreaView} from 'react-native-safe-area-context';

const CameraScreen = () => {
  const currentUser = useContext(UserContext);
  const currentUserUID = currentUser ? currentUser.uid : null;

  const {userData, loading: userDataLoading} = currentUserUID
    ? useUserData(currentUserUID, ['isSnipingEnabled'])
    : {userData: null, loading: false};

  const [cameraReady, setCameraReady] = useState(false);

  // Handle app state
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      setAppState(newState);
    }

    const subscription = AppState.addEventListener('change', onChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle camera active status
  const isFocused = useIsFocused();
  const isActive = isFocused && appState === 'active';

  // Handle camera permission
  const {hasPermission, requestPermission} = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // Handle setting camera ready state
  useEffect(() => {
    if (hasPermission && userData?.isSnipingEnabled) {
      setCameraReady(true);
    } else {
      setCameraReady(false);
    }
  }, [hasPermission, userData]);

  // Handle flash
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
  function cycleFlash() {
    if (flash === 'off') {
      setFlash('auto');
    } else if (flash === 'auto') {
      setFlash('on');
    } else {
      setFlash('off');
    }
  }

  // Handle camera
  const [cameraDirection, setCameraDirection] = useState<'front' | 'back'>(
    'back',
  );
  const device = useCameraDevice(cameraDirection);
  const camera = useRef<Camera>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  async function takePhoto() {
    const photo = await camera.current?.takePhoto({
      flash: device?.hasFlash ? flash : 'off',
    });
    setPhotoPath(photo?.path ?? null);
  }

  // Handle target
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);
  const [targetAvatar, setTargetAvatar] = useState('');
  const [targetUsername, setTargetUsername] = useState('');
  const [showDefaultAvatar, setShowDefaultAvatar] = useState(true);

  //Handle navigation to target profile
  const navigation = useNavigation();
  // Navigate to profile function
  // const navigateToProfile = targetId => {
  //   if (targetId) {
  //     navigation.navigate('ProfileMain', {userId: targetId}); // Replace 'Profile' with the actual route name and parameter
  //   }
  // };

  useEffect(() => {
    if (!currentUser) return;
    let targetId = '';
    // Query the database for the sniper's name
    const targetRef = doc(FIREBASE_STORE, 'Targets', currentUser.uid);
    getDoc(targetRef).then(result => {
      if (result.exists()) {
        targetId = result.data().target_id;
        setCurrentTarget(targetId);
        let targetAvatarUrl = '';
        const targetAvatarRef = doc(FIREBASE_STORE, 'Users', targetId);
        getDoc(targetAvatarRef).then(result => {
          if (result.exists()) {
            targetAvatarUrl = result.data().avatar_url;
            getImageUrlAndUsername(targetAvatarUrl, targetId);
          }
        });
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (targetAvatar) {
      // If there is a target avatar, set showDefaultAvatar to false
      setShowDefaultAvatar(false);
    }
  }, [targetAvatar]);

  const getImageUrlAndUsername = async (
    avatar_url: string,
    targetId: string,
  ) => {
    const storage = FIREBASE_STORAGE;
    const imageRef = ref(storage, avatar_url);
    try {
      if (avatar_url) {
        // Check if the avatar URL exists
        const url = await getDownloadURL(imageRef);
        setTargetAvatar(url);
      } else {
        setShowDefaultAvatar(true); // If no avatar URL, show the default avatar
      }

      // Assuming the username is stored in the user document
      const userRef = doc(FIREBASE_STORE, 'Users', targetId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const name = userDoc.data().name; // Make sure this is the correct field for username
        setTargetUsername(name);
      }
    } catch (error) {
      console.error(
        'Error getting download URL or username for Target in Camera Page:',
        error,
      );
    }
  };

  // Handle posting
  async function postPhoto() {
    if (!photoPath || !currentUser || !currentTarget) {
      console.log('Failed to post: No photo or user not loaded');
      return;
    }

    // Check if there was already a post today
    const today = new Date();
    const date =
      today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
    const q = doc(FIREBASE_STORE, 'Posts', currentUser.uid + date);
    const snapshot = await getDoc(q);
    if (snapshot.exists()) {
      console.log('Already posted today');
      setPhotoPath(null);
      return;
    }

    const storageRef = ref(
      FIREBASE_STORAGE,
      'snipes/' + currentUser.uid + '/' + date + '.jpg',
    );

    // Read file data from path
    const blob = await fetch('file://' + photoPath).then(
      response => {
        return response.blob();
      },
      error => {
        console.log(error);
      },
    );

    if (blob == null) {
      console.log('Failed to read file data from path');
      return;
    }

    // Upload file data
    const filePath =
      'gs://snipeme-22003.appspot.com/' +
      (await uploadBytes(storageRef, blob).then(snapshot => {
        return snapshot.metadata.fullPath;
      }));

    if (!filePath) {
      console.log('Failed to upload file');
      return;
    }

    // Create a new snipe in the database
    const snipeRef = doc(FIREBASE_STORE, 'Posts', currentUser.uid + date);
    const snipeData = {
      approved: false,
      sniper_id: currentUser.uid,
      target_id: currentTarget,
      image: filePath,
      timestamp: new Date(),
    };
    await setDoc(snipeRef, snipeData).then(
      () => {
        console.log('Snipe added to database: ' + filePath);
      },
      error => {
        console.error('Error adding snipe to database', error);
      },
    );

    setPhotoPath(null);

    const notification = {
      target_id: currentTarget,
      sender_id: currentUser.uid,
      message_type: 'sniped',
    };
    sendNotification(notification);
  }

  if (userDataLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (userData && !userData.isSnipingEnabled) {
    return (
      <View style={styles.centered}>
        <Text style={styles.warningText}>
          Sniping is currently disabled. You cannot take or post photos.
        </Text>
      </View>
    );
  }

  if (hasPermission && cameraReady && userData?.isSnipingEnabled) {
    if (photoPath) {
      return (
        <View style={StyleSheet.absoluteFill}>
          <Image
            style={StyleSheet.absoluteFill}
            src={'file://' + photoPath}
            alt="captured photo"
          />
          <Button
            onPress={() => setPhotoPath(null)}
            style={{
              position: 'absolute',
              bottom: 110,
              left: 50,
              alignSelf: 'flex-start',
              backgroundColor: 'white',
            }}>
            <Text style={{color: 'black'}}>Retake</Text>
          </Button>
          <Button
            onPress={postPhoto}
            style={{
              position: 'absolute',
              bottom: 110,
              right: 50,
              alignSelf: 'flex-end',
              backgroundColor: 'black',
            }}>
            <Text style={{color: 'white'}}>Post!</Text>
          </Button>
        </View>
      );
    }
    if (!device) {
      return <Text>Loading...</Text>;
    }
    if (!photoPath) {
      return (
        <View style={styles.back}>
          {/* Conditionally render the target avatar if it exists */}
          {targetAvatar ? (
            <Image
              source={{uri: targetAvatar}}
              style={styles.targetAvatarOverlay}
              onError={error => {
                console.error('Image loading failed:', error);
                // Handle error for image loading here, if necessary
              }}
            />
          ) : null}

          {/* Adjust the position of the username text depending on whether there's an avatar */}
          <Text
            style={[
              styles.targetUsernameLabel,
              // If there's no avatar, apply the additional style to move the text up
              !targetAvatar && styles.noAvatarTextPosition,
            ]}>
            {`Target: ${targetUsername || 'No target!'}`}
          </Text>
          <Camera
            ref={camera}
            photo={true}
            style={styles.camera}
            device={device}
            isActive={isActive}
          />
          <IconButton
            icon={'checkbox-blank-circle-outline'}
            onPress={takePhoto}
            style={{
              position: 'absolute',
              bottom: 110,
              alignSelf: 'center',
              backgroundColor: 'white',
            }}
            size={80}
            iconColor="black"
          />
          <IconButton
            icon={flash === 'on' ? 'flash' : 'flash-' + flash}
            onPress={cycleFlash}
            style={{
              position: 'absolute',
              bottom: 110,
              left: 30,
              alignSelf: 'flex-start',
              backgroundColor: '#272626',
            }}
            iconColor="white"
            size={40}
          />
          <IconButton
            icon={'autorenew'}
            onPress={() =>
              setCameraDirection(cameraDirection === 'back' ? 'front' : 'back')
            }
            style={{
              position: 'absolute',
              bottom: 110,
              right: 30,
              alignSelf: 'flex-end',
              backgroundColor: '#272626',
            }}
            size={40}
            iconColor="white"
          />
        </View>
      );
    }
  } else {
    return (
      <Text>No access to camera. Go to your settings to provide access.</Text>
    );
  }
};

const styles = StyleSheet.create({
  // Add your existing styles...
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  camera: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 220,
  },
  back: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  targetAvatarOverlay: {
    position: 'absolute',
    left: '50%',
    top: 60, // Adjust as needed
    width: 60, // Adjust as needed
    height: 60, // Adjust as needed
    borderRadius: 30, // This makes it round
    transform: [{translateX: -25}, {translateY: -25}], // Center the element
    zIndex: 10, // Make sure it's above other UI elements
  },
  targetUsernameLabel: {
    position: 'absolute',
    top: 110, // Adjust as needed to position below the avatar image
    alignSelf: 'center', // Center the text element within the parent view
    color: 'white',
    textAlign: 'center', // Center the text within the text element
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 11,
    overflow: 'hidden',
  },
  noAvatarTextPosition: {
    // Additional styling to move text up when there is no avatar
    top: 40, // Adjust the value as needed to position the text higher
  },
});

export default CameraScreen;
