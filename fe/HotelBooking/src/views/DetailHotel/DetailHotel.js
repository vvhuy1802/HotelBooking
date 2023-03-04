import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {useEffect, useState, useRef} from 'react';

const DetailHotel = ({navigation, route}) => {
  const dataHotel = route.params;
  const mapRef = useRef(null);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: dataHotel.position[0],
          longitude: dataHotel.position[1],
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
            coordinate={{
                latitude: dataHotel.position[0],
                longitude: dataHotel.position[1],
                }}
            title={dataHotel.name}
            description={dataHotel.address}
        />
        </MapView>
    </View>
  );
};

export default DetailHotel;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
