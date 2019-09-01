import { AppLoading } from 'expo';
import React, { useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import { Provider } from 'mobx-react';
import store from './store';
import { AppNavigator } from './navigation/AppNavigator';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }
  return (
    <Provider store={store}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    </Provider>
  );
}

async function loadResourcesAsync() {
  // await Promise.all([
  //   AsyncStorage.setItem('__DataBase__', JSON.stringify(dataBase)),
  // ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
