import store from './redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {
  getAsyncStorage,
  setAsyncStorage,
} from './functions/asyncStorageFunctions';

const PushNotifyToLocalStorage = async remoteMessage => {
  let notify = await getAsyncStorage('notify');
  if (notify) {
    notify = JSON.parse(notify);
    notify.push(remoteMessage);
    await setAsyncStorage('notify', JSON.stringify(notify));
  } else {
    notify = [];
    notify.push(remoteMessage);
    await setAsyncStorage('notify', JSON.stringify(notify));
  }
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  await PushNotifyToLocalStorage(remoteMessage);
});
AppRegistry.registerComponent(appName, () => () => (
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
));
