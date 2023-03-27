import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Text, View, LogBox, PermissionsAndroid} from 'react-native';
import Lottie from 'lottie-react-native';
import RootNavigation from './src/navigation/root';
import {
  setAsyncStorage,
  getAsyncStorage,
} from './functions/asyncStorageFunctions';
import {CheckLogin} from './middlewares/auth';
import {GetAllHotels} from './middlewares/hotels';
import {useDispatch} from 'react-redux';
import Globalreducer from './redux/Globalreducer';
import i18n from './src/i18n/18n';
import {
  requestUserPermission,
  NotificationService,
} from './src/utils/PushNotification';
//logbox ignore all
LogBox.ignoreAllLogs();
const App = () => {
  const dispatch = useDispatch();
  const [wait, setWait] = useState(true);

  useEffect(() => {
    getAsyncStorage('userData').then(token => {
      if (token) {
        CheckLogin(token).then(res => {
          if (res.status === 200) {
            console.log('User logged in');
            dispatch(Globalreducer.actions.setUserData(res.data.data.user));
          } else {
            console.log('Token expired');
            dispatch(Globalreducer.actions.setUserData(''));
          }
        });
      } else {
        console.log('User not logged in');
        dispatch(Globalreducer.actions.setUserData(''));
      }
    });
  }, []);

  useEffect(() => {
    GetAllHotels().then(res => {
      if (res.status === 200) {
        console.log('Data hotels geted');
        res.data = res.data.filter(
          (item: {isactive: boolean}) => item.isactive === true,
        );
        dispatch(Globalreducer.actions.setHotels(res.data));
        setWait(false);
      }
    });
  }, []);

  useEffect(() => {
    getAsyncStorage('language').then(lang => {
      console.log('Languauge: ' + lang);
      if (lang) {
        i18n.changeLanguage(lang);
      } else {
        console.log('Languauge: en');
        i18n.changeLanguage('en');
        setAsyncStorage('language', 'en');
      }
    });
  }, []);

  useEffect(() => {
    getAsyncStorage('theme').then(theme => {
      if (theme) {
        console.log('Theme: ' + theme);
        dispatch(Globalreducer.actions.setTheme(theme));
      } else {
        console.log('No theme');
        setAsyncStorage('theme', 'light');
      }
    });
  }, []);

  const componentDidMount = () => {
    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          Globalreducer.actions.setUserPosition({
            // latitude: position.coords.latitude,
            // longitude: position.coords.longitude,
            latitude: 10.8702,
            longitude: 106.8028,
          }),
        );
      },
      error => {
        console.log(error.message);
        dispatch(
          Globalreducer.actions.setUserPosition({
            latitude: 10.8702,
            longitude: 106.8028,
          }),
        );
      },
      {enableHighAccuracy: true},
    );
  };
  const requestLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Hotel Booking App needs access to your location ' +
            'so you can see your current location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocation();
    componentDidMount();
    requestUserPermission();
    NotificationService();
  }, []);

  return (
    <View style={{flex: 1}}>
      {wait ? (
        <View
          style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
          <Lottie
            source={require('./src/assets/animations/loading-circle.json')}
            autoPlay
            loop
          />
        </View>
      ) : (
        <RootNavigation />
      )}
    </View>
  );
};

export default App;
