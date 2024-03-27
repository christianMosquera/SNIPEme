import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
}
export async function getToken() {
    let token = await AsyncStorage.getItem('notifToken');
    if (!token) {
        try {
            token = await messaging().getToken();
            if (token && typeof(token) === 'string') {
                await AsyncStorage.setItem("notifToken", token)
            }
        }
        catch(error) {
            console.log(error, "error in token");
        }
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
