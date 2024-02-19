/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import IndexStack from './src/navigation/IndexStack';
import {PaperProvider} from 'react-native-paper';

function App(): React.JSX.Element {
  return (
    <PaperProvider>
      <IndexStack />
    </PaperProvider>
  );
}

export default App;
