import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FIREBASE_STORE} from '../../firebase';
import { doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import {PermissionsAndroid} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";

type MessageType = "none" | "default" | "info" | "success" | "danger" | "warning";

const MESSAGETITLE = new Map<string, string>([
  ['sniped', 'You have been sniped!'],
  ['approved', 'Snipe approved!'],
  ['rejected', 'Snipe rejected!'],
  ['friend', 'Friend request'],
  ['accepted', 'Friend request']
]);

const MESSAGEBODY = new Map<string, string>([
  ['sniped', 'sniped you! Approve to post this snipe.'],
  ['approved', 'approved your snipe! Snipe has been posted.'],
  ['rejected', 'rejected your snipe! Snipe has been deleted.'],
  ['friend', 'requested to follow you.'],
  ['accepted', 'accepted your follow request.']
]);

const DISPLAYMESSAGE = new Map<string, string>([
  ['sniped', 'sniped you!'],
  ['approved', 'approved your snipe!'],
  ['rejected', 'rejected your snipe!'],
  ['friend', 'requested to follow you!'],
  ['accepted', 'accepted your follow request!'],
]);

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  const checkPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (checkPermission == false) {
    const request = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
}
export async function getToken() {
  let token = await AsyncStorage.getItem('notifToken');
  if (!token) {
    try {
      token = await messaging().getToken();
      if (token && typeof token === 'string') {
        await AsyncStorage.setItem('notifToken', token);
      }
    } catch (error) {
      console.log('error in getting token:', error);
    }
  }
}

export async function setToken(currentUser: any) {
  try {
    const token = await AsyncStorage.getItem('notifToken');
    if (!currentUser) return;
    const userId = currentUser?.uid;
    const usersRef = doc(FIREBASE_STORE, 'Users', userId);
    await updateDoc(usersRef, {
      device_token: token,
    });
  } catch (err) {
    console.log('Error in setting token:', err);
  }
}

export function NotificationListener() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on foreground state', remoteMessage);
    const title = remoteMessage.notification?.title;
    const body = remoteMessage.notification?.body;
    const type : MessageType = "default"
    if (typeof(title) != 'string' || typeof(body) != 'string') return;
    const notification = {
      message: title,
      description: body,
      type: type,
      backgroundColor: "white", // background color
      color: "black", // text color
      onPress: () => {
        console.log("pressed!");
      }
    }
    showMessage(notification);
  });
}

// Target_id : the uid of the user that you want to send notifications to.
// Title: string text
// body: string text
export const sendNotification = async ({
  target_id,
  sender_id,
  message_type,
}: {
  target_id: string;
  sender_id: string;
  message_type: string;
}) => {
  const usersRef = doc(FIREBASE_STORE, 'Users', target_id);
  const docSnap = await getDoc(usersRef);
  let to = '';
  if (docSnap.exists()) {
    to = docSnap.data().device_token;
  }

  const senderName = await getUsername(sender_id);
  const key =
    'AAAAKdWzAgE:APA91bGlOTp7xoTGh4U-WrrOgtsbrJ2Qpq-y_Cw_izt1OoKUseBObRr3HlB7y7Opbomtqp03EHcvPJVn5wc-3byOveFL9wWCR_jXIiBKlA1Ud8YigzZ9y_RAA2URFl_81YNt92lka5I-';
  const notification = {
    title: MESSAGETITLE.get(message_type),
    body: `${senderName} ${MESSAGEBODY.get(message_type)}`,
  };

  const notificationRef = doc(FIREBASE_STORE, 'Notifications', target_id);
  const notifSnap = await getDoc(notificationRef);

  if(!notifSnap.exists()) {
    await setDoc(notificationRef, {Notifications:[]});
  }
  const currentArray = notifSnap.data()?.Notifications || [];
  const newNotification = {
    sender_id: sender_id,
    message_type: message_type,
    message: `${senderName} ${DISPLAYMESSAGE.get(message_type)}`
  };
  const updatedArray = [newNotification, ...currentArray];

  await updateDoc(notificationRef, { Notifications: updatedArray });

  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: 'key=' + key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notification: notification,
      to: to,
    }),
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const getUsername = async (userId: string) => {
  const usersRef = doc(FIREBASE_STORE, 'Users', userId);
  try {
    const docSnap = await getDoc(usersRef);
    if (docSnap.exists()) {
      return docSnap.data().username;
    }
  } catch (err) {
    console.log('Error getting username:', err);
  }
};
