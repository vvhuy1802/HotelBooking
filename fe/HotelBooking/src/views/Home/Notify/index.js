import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {getAsyncStorage} from '../../../../functions/asyncStorageFunctions';
import TopTabNavigator from './TopTabNavigator';
import {ContextNotify} from '../../../contexts/index';

export default function NotificationPage() {
  const [notify, setNotify] = useState([]);
  useEffect(() => {
    const getNotify = async () => {
      let notify = await getAsyncStorage('notify');
      setNotify(JSON.parse(notify));
    };
    getNotify();
  }, []);

  return (
    <SafeAreaProvider>
      <ContextNotify.Provider value={{notify, setNotify}}>
        <TopTabNavigator />
      </ContextNotify.Provider>
    </SafeAreaProvider>
  );
}
