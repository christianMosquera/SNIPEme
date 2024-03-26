/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import IndexStack from './src/navigation/IndexStack';
import {PaperProvider} from 'react-native-paper';
import {GlobalProvider} from './src/contexts/GlobalContext';
import { FIREBASE_APP } from './firebase';

function App(): React.JSX.Element {
  let _ = FIREBASE_APP; // Ensure Firebase is initialized
  return (
    <PaperProvider>
      <GlobalProvider>
        <IndexStack />
      </GlobalProvider>
    </PaperProvider>
  );
}

export default App;
