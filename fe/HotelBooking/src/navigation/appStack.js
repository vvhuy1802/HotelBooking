import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DetailHotel from '../views/DetailHotel/DetailHotel';
import TabNavigator from './tabNavigator';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailHotel"
        component={DetailHotel}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
