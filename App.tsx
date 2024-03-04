/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import IndexStack from './src/navigation/IndexStack';
import {PaperProvider} from 'react-native-paper';
import {UserProvider} from './src/contexts/UserContext';

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <UserProvider>
        <IndexStack />
      </UserProvider>
    </PaperProvider>
  );
}

export default App;
