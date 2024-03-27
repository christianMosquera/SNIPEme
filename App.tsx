/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import IndexStack from './src/navigation/IndexStack';
import {PaperProvider} from 'react-native-paper';
import {UserProvider} from './src/contexts/UserContext';
import { Alert, AppRegistry, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging'
import {NotificationListener, requestUserPermission} from './src/utils/pushnotification'

function App(): React.JSX.Element {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  })
  return (
    <PaperProvider>
      <UserProvider>
        <IndexStack />
      </UserProvider>
    </PaperProvider>
  );
}

export default App;
