import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TopTabNavigator from './TopTabNavigator';

export default function NotificationPage() {
  return (
    <SafeAreaProvider>
      <TopTabNavigator />
    </SafeAreaProvider>
  );
}
