import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DetailHotel from '../views/DetailHotel/DetailHotel';
import Map from '../views/DetailHotel/Map';
import AllComments from '../views/DetailHotel/AllComments';
import DetailRoom from '../views/DetalRoom/DetailRoom';
import ImageRoom from '../views/DetalRoom/ImageRoom';
import OrderRoom from '../views/OrderRoom/OrderRoom';
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
      <Stack.Screen
        name="DetailRoom"
        component={DetailRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllComments"
        component={AllComments}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ImageRoom"
        component={ImageRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderRoom"
        component={OrderRoom}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
