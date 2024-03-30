import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_STORE } from '../../firebase';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}
export async function getToken(){
    let token = await AsyncStorage.getItem('notifToken');
    console.log(token)
    if (!token) {
        try {
            token = await messaging().getToken();
            if (token && typeof(token) === 'string') {
                await AsyncStorage.setItem("notifToken", token);

            }
        }
        catch(error) {
            console.log("error in getting token:", error);
        }
    }
}

export async function setToken(currentUser:any) {
    try {
        const token = await AsyncStorage.getItem('notifToken');
        if (!currentUser) return;
        const userId = currentUser?.uid
        const usersRef = doc(FIREBASE_STORE, 'Users', userId);
        await updateDoc(usersRef, {
            device_token: token
        });

    } catch(err) {
        console.log("Error in setting token:", err);
    }
}

export function NotificationListener(){
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification cuased app to open from background state:', remoteMessage.notification,
        );
    });

    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage.notification)
        }
    });

    messaging().onMessage(async remoteMessage => {
        console.log("notification on foreground state", remoteMessage);
    })
}

export const sendNotification = async ({target_id, title, body}: {target_id:string, title:string, body:string}) => {
    const usersRef = doc(FIREBASE_STORE, 'Users', target_id);
    const docSnap = await getDoc(usersRef);
    let to = '';
    if (docSnap.exists()) {
        to = docSnap.data().device_token;
    }
    const key = 'AAAAKdWzAgE:APA91bGlOTp7xoTGh4U-WrrOgtsbrJ2Qpq-y_Cw_izt1OoKUseBObRr3HlB7y7Opbomtqp03EHcvPJVn5wc-3byOveFL9wWCR_jXIiBKlA1Ud8YigzZ9y_RAA2URFl_81YNt92lka5I-';
    const notification = {
    'title': title,
    'body': body,
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
    'method': 'POST',
    'headers': {
        'Authorization': 'key=' + key,
        'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
        'notification': notification,
        'to': to
    })
    }).then(function(response) {
    console.log(response);
    }).catch(function(error) {
    console.error(error);
    })
};
