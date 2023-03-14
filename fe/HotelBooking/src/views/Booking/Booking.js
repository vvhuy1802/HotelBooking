import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

const Booking = () => {
  const {userData} = useSelector(state => state.Globalreducer);
  return (
    <View>
      <Text>Booking</Text>
    </View>
  );
};

export default Booking;

const styles = StyleSheet.create({});
