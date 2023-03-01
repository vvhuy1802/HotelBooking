import React, {useEffect, useState} from 'react';
import {Text, View, LogBox} from 'react-native';
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
            setWait(false);
          } else {
            console.log('Token expired');
            dispatch(Globalreducer.actions.setUserData(''));
            setWait(false);
          }
        });
      } else {
        console.log('User not logged in');
        dispatch(Globalreducer.actions.setUserData(''));
        setWait(false);
      }
    });
  }, []);

  useEffect(() => {
    GetAllHotels().then(res => {
      if (res.status === 200) {
        console.log('Data hotels geted');
        dispatch(Globalreducer.actions.setHotels(res.data));
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

  return (
    <View style={{flex: 1}}>
      {wait ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
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
