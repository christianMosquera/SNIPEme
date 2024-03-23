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

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <GlobalProvider>
        <IndexStack />
      </GlobalProvider>
    </PaperProvider>
  );
}

export default App;
