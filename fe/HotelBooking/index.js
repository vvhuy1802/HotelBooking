import store from './redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
));
