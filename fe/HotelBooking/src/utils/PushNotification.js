import messaging from '@react-native-firebase/messaging';
import {
  setAsyncStorage,
  getAsyncStorage,
} from '../../functions/asyncStorageFunctions';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await getAsyncStorage('fcmToken');
  console.log('Old fcmToken: ', fcmToken);
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await setAsyncStorage('fcmToken', fcmToken);
        console.log('New fcmToken: ', fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const NotificationService = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  //Foreground notification
  messaging().onMessage(async remoteMessage => {
    console.log('Notification in Foreground', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });
};
