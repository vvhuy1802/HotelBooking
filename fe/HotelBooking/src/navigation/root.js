import React from 'react';
import {StatusBar} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './authStack';
import AppStack from './appStack';
import {useSelector} from 'react-redux';
import {CheckLogin} from '../../middlewares/auth';
export default function RootNavigation() {
  const {userData,theme} = useSelector(state => state.Globalreducer);
  // console.log(userData.roll);

  const lightTheme = {
    colors: {
      text: '#000',
      untext: '#fff',
      bg: '#fff',
      icon: '#808080',
      box: '#fff',
      special: '#f5f5f5',
      primary: '#52c0b4',
    },
  };

  const darkTheme = {
    colors: {
      text: '#fff',
      untext: '#000',
      bg: '#000',
      icon: '#fff',
      box: '#1a1a1a',
      special: '#666161',
      primary: '#52c0b4',
    },
  };

  return (
    <PaperProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <StatusBar
        backgroundColor={theme === 'light' ? '#fff' : '#000'}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
    <NavigationContainer>
      {userData ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
    </PaperProvider>
  );
}
