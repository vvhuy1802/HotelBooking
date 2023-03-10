import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useTheme} from 'react-native-paper';
import Lottie from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
const OrderRoom = ({navigation, route}) => {
  const dataRoom = route.params.room;
  const dataHotel = route.params.hotel;
  const {user_position, userData, booking_date} = useSelector(
    state => state.Globalreducer,
  );
  const {colors} = useTheme();
  const {t} = useTranslation();
  const image_default =
    'https://img1.ak.crunchyroll.com/i/spire3/d23bea1cbe84833135f94695d900f0651651339079_main.png';

  const FormatNameRoom = name => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

  const FormatDayMonthYear = date => {
    const arr = date.split('-');
    const day = arr[2];
    const month = arr[1];
    const year = arr[0];
    return `${day}/${month}/${year}`;
  };

  const CheckTimeCheckIn = () => {
    if (
      FormatDayMonthYear(booking_date.check_in) ===
        FormatDayMonthYear(new Date().toISOString().slice(0, 10)) &&
      FormatDayMonthYear(booking_date.check_out) ===
        FormatDayMonthYear(
          new Date(new Date().setDate(new Date().getDate() + 1))
            .toISOString()
            .slice(0, 10),
        )
    ) {
      const now = new Date().getHours();
      return now < 12 ? '12:00' : '14:00';
    }
    return '12:00';
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader title={'information-booking'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: colors.special,
        }}>
        <View style={{marginTop: 10, backgroundColor: colors.bg, padding: 10}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
            {t('information-booking')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
              width: width - 120,
            }}>
            <View>
              <Image
                style={{
                  width: 120,
                  height: 80,
                  borderRadius: 10,
                }}
                source={{uri: image_default}}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 14, color: colors.text}}>
                {dataHotel.name}
              </Text>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', color: colors.text}}>
                {FormatNameRoom(dataRoom.name)}
              </Text>
              <Text style={{fontSize: 14, color: colors.text}}>
                {dataHotel.address}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: colors.primary,
              marginTop: 10,
            }}
          />
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            <ImageBackground
              style={{
                width: 120,
                height: 110,
                overflow: 'hidden',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={
                booking_date.total_night == 1
                  ? require('../../assets/purple_bg.jpg')
                  : require('../../assets/blue_bg.jpeg')
              }>
              <Icon
                name={booking_date.total_night == 1 ? 'moon' : 'calendar'}
                size={25}
                color='white'
                style={{marginTop: 15}}
              />
              <Text
                style={{
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                {booking_date.total_night}{' '}
                {booking_date.total_night == 1
                  ? t('night')
                  : t('day') === 'day'
                  ? 'days'
                  : 'day'}
              </Text>
            </ImageBackground>
            <View
              style={{
                marginLeft: 10,
                width: width - 150,
                height: 110,
                backgroundColor: colors.special,
                borderRadius: 10,
                padding: 10,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={{color: colors.icon}}>{t('check-in')}</Text>
                <Text style={{color: colors.text, fontWeight: 'bold'}}>
                  {CheckTimeCheckIn()}
                  {'  -  '}
                  {FormatDayMonthYear(booking_date.check_in)}
                </Text>
              </View>
              <View>
                <Text style={{color: colors.icon}}>{t('check-out')}</Text>
                <Text style={{color: colors.text, fontWeight: 'bold'}}>
                  12:00 - {FormatDayMonthYear(booking_date.check_out)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{marginTop: 10, backgroundColor: colors.bg, padding: 10}}>
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 20, fontWeight: 'bold', color: colors.text}}>
                {t('booker-information')}
              </Text>
              <Text style={{fontSize: 17, fontWeight: 'bold', color: 'orange'}}>
                {t('edit')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
                {t('name')}
              </Text>
              <Text
                style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
                {userData.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{fontSize: 16, color: colors.icon, fontWeight: '500'}}>
                {t('phone')}
              </Text>
              <Text
                style={{fontSize: 16, color: colors.text, fontWeight: 'bold'}}>
                {userData.phone_number}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderRoom;

const styles = StyleSheet.create({});
