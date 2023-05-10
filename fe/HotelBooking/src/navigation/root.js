import React from 'react';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './authStack';
import AppStack from './appStack';
import {useSelector} from 'react-redux';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {View, Text, Image} from 'react-native';

const formatLongText = text => {
  if (text?.length > 110) {
    return text.slice(0, 110) + '...';
  }
  return text;
};

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  notifyBasic: ({text1, text2, props}) => (
    <View
      style={{
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        
      }}>
      <View style={{padding: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/logo_mini.png')}
              style={{
                width: 25,
                height: 25,
                resizeMode: 'cover',
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: 'black',
              marginLeft: 10,
            }}>
            {text1}
          </Text>
        </View>
        <View style={{marginTop: 5}}>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              fontWeight: '400',
              lineHeight: 20,
              textAlign: 'justify',
              overflow: 'hidden',
              height: text2 > 110 ? 40 : null,
            }}>
            {formatLongText(text2)}
          </Text>
        </View>
      </View>
    </View>
  ),
};

export default function RootNavigation() {
  const {userData, theme} = useSelector(state => state.global);
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
      blurprimary: '#c8f4ef',
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
      blurprimary: '#c8f4ef',
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
      <Toast config={toastConfig} />
    </PaperProvider>
  );
}
