import slugify from '@sindresorhus/slugify';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useTheme} from 'react-native-paper';
import Icon5 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Globalreducer from '../../../redux/Globalreducer';
import {AddNewComment} from '../../../middlewares/comments';
import {UpdateReview} from '../../../middlewares/orders';

const width = Dimensions.get('screen').width;
const WINDOW_HEIGHT = Dimensions.get('screen').height;
const SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.8;
const SHEET_MIN_HEIGHT = WINDOW_HEIGHT * 0.1;
const MAX_UPWARD_TRANSLATE_Y = -SHEET_MIN_HEIGHT - SHEET_MAX_HEIGHT; // negative number
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 50;
const DetailHotel = ({navigation}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const star = [1, 2, 3, 4, 5];
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const {height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.009;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [starhotel, setStarhotel] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ratecontent, setRatecontent] = useState('');
  const {user_position, hotelData, userData, booking_date} = useSelector(
    state => state.Globalreducer,
  );
  const image_default =
    'https://img1.ak.crunchyroll.com/i/spire3/d23bea1cbe84833135f94695d900f0651651339079_main.png';

  const Format = number => {
    var price = number * booking_date.total_night;
    return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const calculateDistance = () => {
    const lat1 = user_position.latitude;
    const lon1 = user_position.longitude;
    const lat2 = hotelData.position[0];
    const lon2 = hotelData.position[1];
    const R = 6371; // radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // distance in km

    return d.toFixed(2);
  };

  const FormatTimeStamp = date => {
    //format time stamp like 12:46 3/3/2023
    const today = new Date(date);
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const time = day + '/' + month + '/' + year;
    return time;
  };

  const FormatRoomNameInComment = name => {
    if (name?.length > 30) {
      return name.slice(0, 30) + '...';
    }
    return name;
  };

  const starTemp = [1, 2, 3, 4, 5];
  const TotalStar = () => {
    let rating = 0;
    if (hotelData.comments?.length === 0) return 5;
    hotelData.comments?.map(item1 => {
      rating += item1.rating;
    });
    return starTemp.includes(rating / hotelData.comments.length)
      ? rating / hotelData.comments.length
      : (rating / hotelData.comments.length).toFixed(1);
  };

  const formatDayShow = day => {
    if (day != '') {
      return day.split('-')[2] + '/' + day.split('-')[1];
    }
    return '';
  };

  const FormatAddress = address => {
    if (address.length > 45) {
      return address.slice(0, 45) + '...';
    }
    return address;
  };

  const CheckIdRoom = () => {
    var id_room = '1';
    var id_order = '';
    var name_room = '';
    var index = 0;
    userData.orders.forEach((order, index) => {
      if (order.id_hotel === hotelData.id) {
        if (order.reviewed === false) {
          id_room = order.id_room._id;
          name_room = order.id_room.name;
          id_order = order._id;
          index = index;
        }
      }
    });
    return {
      id_room: id_room,
      id_order: id_order,
      index: index,
      name_room: name_room,
    };
  };

  const handleRating = async () => {
    if (ratecontent === '' || starhotel === 0) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
    } else {
      if (CheckIdRoom().id_room !== '1') {
        const comment = {
          content: ratecontent,
          rating: starhotel,
          id_user: {
            name: userData.name,
          },
          id_room: {
            _id: CheckIdRoom().id_room,
            name: CheckIdRoom().name_room,
          },
          time_stamp: new Date(),
        };
        AddNewComment(
          userData._id,
          hotelData.id,
          CheckIdRoom().id_room,
          ratecontent,
          starhotel,
        ).then(res => {
          if (res.status === 200) {
            ToastAndroid.show('Comment success', ToastAndroid.SHORT);
            dispatch(
              Globalreducer.actions.addComment({
                id: hotelData.id,
                comment: comment,
                index: CheckIdRoom().index,
              }),
            );
          } else {
            ToastAndroid.show(
              'You have not booked this hotel yet',
              ToastAndroid.SHORT,
            );
          }
        });
        UpdateReview(CheckIdRoom().id_order);
      } else {
        ToastAndroid.show(
          'You have not booked this hotel yet',
          ToastAndroid.SHORT,
        );
      }
      setRatecontent('');
      setStarhotel(0);
      setModalVisible(false);
    }
  };

  const AnimatedView = Animated.createAnimatedComponent(View);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const HeaderAnimated = {
    opacity: animatedValue.interpolate({
      inputRange: [150, 300],
      outputRange: [0, 1],
    }),
  };
  const HeaderAnimatedScroll = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0],
    }),
  };
  //Bottom Sheet
  const animatedValueBottom = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValueBottom.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValueBottom.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValueBottom.flattenOffset();
        if (gesture.dy > 0) {
          // is dragging down
          if (lastGestureDy.current !== 0 && gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up');
          } else {
            springAnimation('down');
          }
        } else {
          // is dragging up
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down');
          } else {
            springAnimation('up');
          }
        }
      },
    }),
  ).current;
  const springAnimation = direction => {
    lastGestureDy.current =
      direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;
    Animated.spring(animatedValueBottom, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };
  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValueBottom.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  //Calendar
  const minday = new Date();
  const [start, setStart] = useState(booking_date.check_in);
  const [startTrue, setStartTrue] = useState(booking_date.check_in);
  const [middle, setMiddle] = useState([]);
  const [end, setEnd] = useState(booking_date.check_out);
  const [endTrue, setEndTrue] = useState(booking_date.check_out);

  const handleOpenCalendar = () => {
    springAnimation('up');
    setStart(startTrue);
    setEnd(endTrue);
  };

  useEffect(() => {
    if (start != '' && end != '') {
      const bd = start.split('-');
      const kt = end.split('-');
      const arr = [];
      if (kt[1] == bd[1]) {
        const sub = kt[2] - bd[2];
        for (let i = 1; i < sub; i++) {
          var day = kt[2] - i < 10 ? '0' + (kt[2] - i) : kt[2] - i;
          arr.push(`${kt[0]}-${kt[1]}-${day}`);
        }
      } else {
        var maxDayOfMonth = new Date(bd[0], bd[1], 0).getDate();
        const sub = maxDayOfMonth - bd[2];
        for (let i = 1; i <= sub; i++) {
          arr.push(`${bd[0]}-${bd[1]}-${bd[2] - 0 + i}`);
        }
        for (let i = 1; i < kt[2]; i++) {
          var day = i < 10 ? '0' + i : i;
          arr.push(`${kt[0]}-${kt[1]}-${day}`);
        }
      }
      setMiddle(arr);
    }
  }, [end]);

  const handleChooseDay = day => {
    if (start !== '' && end !== '') {
      setStart(day.dateString);
      setEnd('');
      setMiddle([]);
    }
    if (start === '') {
      setStart(day.dateString);
    } else if (end === '' && day.dateString > start) {
      setEnd(day.dateString);
    } else if (day.dateString < start) {
      setStart(day.dateString);
    }
  };
  const handleConfirm = () => {
    springAnimation('down');
    setStartTrue(start);
    setEndTrue(end);
    dispatch(
      Globalreducer.actions.setBookingDate({
        check_in: start,
        check_out: end,
        total_night: middle.length + 1,
      }),
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.bg}}>
      <AnimatedView
        style={[
          styles.HeaderBack,
          {backgroundColor: colors.bg},
          HeaderAnimated,
        ]}>
        <Icon
          name="arrow-back-ios"
          size={28}
          color={colors.text}
          onPress={navigation.goBack}
        />
        <View style={{alignItems: 'center', paddingRight: 20}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'orange',
            }}>
            {hotelData.name}
          </Text>
          <Text style={{textAlign: 'center', color: colors.icon}}>
            {hotelData.address}
          </Text>
        </View>
        <Icon2 name="heart-outline" size={0} color="black" style={{}} />
      </AnimatedView>
      <AnimatedView style={[styles.HeaderTitle, HeaderAnimatedScroll]}>
        <Icon
          name="arrow-back-ios"
          size={28}
          color="white"
          onPress={navigation.goBack}
        />
      </AnimatedView>
      <ScrollView
        onScroll={e => {
          const currentOffset = e.nativeEvent.contentOffset.y;
          animatedValue.setValue(currentOffset);
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <Image
          source={{uri: image_default}}
          style={{width: width, height: 300, resizeMode: 'cover'}}
        />
        <View style={{paddingHorizontal: 15, paddingBottom: 100}}>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: colors.text,
                paddingVertical: 10,
              }}>
              {hotelData.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon5
                name="star"
                size={20}
                color={'orange'}
                style={{marginLeft: 2}}
              />
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  paddingHorizontal: 5,
                  color: colors.text,
                }}>
                {TotalStar()}
                <Text style={{color: colors.icon}}>
                  {' (' + hotelData.comments.length + ` ${t('review')})`}
                </Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <Icon2
                name="md-location-sharp"
                size={25}
                color="orange"
                style={{}}
              />
              <View
                style={{
                  paddingHorizontal: 2,
                  paddingRight: 20,
                }}>
                <Text style={{color: colors.text, fontSize: 15}}>
                  <Text style={{color: 'orange'}}>
                    ~{calculateDistance()} km
                  </Text>{' '}
                  | {hotelData.address}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('map')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Map', hotelData);
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: colors.primary,
                    marginRight: 5,
                  }}>
                  {t('viewmap')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '99%',
                height: 150,
                marginTop: 10,
              }}>
              <MapView
                ref={mapRef}
                zoomEnabled={false}
                scrollEnabled={false}
                style={{flex: 1}}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                region={{
                  latitude: hotelData.position[0],
                  longitude: hotelData.position[1],
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                <Marker
                  coordinate={{
                    latitude: hotelData.position[0],
                    longitude: hotelData.position[1],
                  }}
                />
              </MapView>
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.text,
              paddingVertical: 15,
            }}>
            {t('list-rooms')}
          </Text>
          {hotelData.rooms.map((items, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.RecentlyBox, {backgroundColor: colors.box}]}
              onPress={() => {
                navigation.navigate('DetailRoom', {
                  room: items,
                  hotel: hotelData,
                });
              }}>
              <View
                style={{
                  width: '100%',
                  height: 150,
                  alignSelf: 'center',
                }}>
                <Image style={styles.IMGRecent} source={{uri: image_default}} />
              </View>
              <View>
                <View style={{paddingHorizontal: 15, paddingVertical: 5}}>
                  <Text
                    style={{
                      fontSize: 20,
                      height: 25,
                      color: colors.text,
                    }}>
                    {items.name}
                  </Text>
                  <View style={{flexDirection: 'row', paddingVertical: 5}}>
                    {items.utility.map((item, index) =>
                      index < 2 ? (
                        <View
                          key={index}
                          style={{
                            alignContent: 'center',
                            justifyContent: 'flex-start',
                            marginRight: 10,
                          }}>
                          <Text style={{color: colors.icon, fontSize: 14}}>
                            {item.split(' ')[1] === 'm²'
                              ? item + ' '
                              : t(`${slugify(item)}`)}
                            <Text style={{color: colors.text}}>
                              {index == 0 ? ' |' : ''}
                            </Text>
                          </Text>
                        </View>
                      ) : (
                        <View key={index}></View>
                      ),
                    )}
                  </View>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      marginTop: 5,
                      fontWeight: '500',
                    }}>
                    {booking_date.total_night} {t('day')}
                    {booking_date.total_night > 1 && t('day') === 'day'
                      ? 's'
                      : ''}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        paddingVertical: 10,
                        fontWeight: 'bold',
                        color: colors.text,
                      }}>
                      {Format(items.price)}{' '}
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.text,
                        }}>
                        đ
                      </Text>
                    </Text>
                    <View
                      style={{
                        width: 100,
                        height: 35,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        backgroundColor: colors.primary,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        {t('choose-room')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('description')}
              </Text>
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                paddingVertical: 10,
              }}>
              {hotelData.description}
            </Text>
          </View>
          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('review')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AllComments', hotelData.comments);
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: colors.text,
                  }}>
                  {t('see-all')}
                </Text>
              </TouchableOpacity>
            </View>
            {hotelData.comments
              .map(
                (item1, index) =>
                  hotelData.comments.length - index <= 3 && (
                    <View
                      key={index}
                      style={{
                        marginTop: 10,
                        width: '100%',
                        backgroundColor: colors.box,
                        borderRadius: 10,
                        elevation: 5,
                        shadowColor: 'black',
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderColor: '#eeeeee',
                        paddingVertical: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: 10,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={require('../../assets/avatars.jpg')}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                            }}
                          />
                          <View style={{marginLeft: 10}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontWeight: '700',
                                  fontSize: 16,
                                  color: colors.text,
                                }}>
                                {item1.id_user.name}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: '400',
                                  marginLeft: 10,
                                }}>
                                {FormatTimeStamp(item1.time_stamp)}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 14,
                                color: colors.text,
                                fontWeight: 'bold',
                              }}>
                              {FormatRoomNameInComment(item1.id_room?.name)}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            backgroundColor: colors.primary,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 15,
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }}>
                          <Icon5 name="star" size={15} color={'yellow'} />
                          <Text style={{color: 'white', marginLeft: 5}}>
                            {item1.rating}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          paddingHorizontal: 20,
                          fontWeight: '400',
                          fontSize: 14,
                          color: colors.text,
                        }}>
                        {item1.content}
                      </Text>
                    </View>
                  ),
              )
              .reverse()}
          </View>
        </View>
      </ScrollView>
      <Animated.View
        style={[
          styles.bottomSheet,
          {backgroundColor: colors.box},
          bottomSheetAnimation,
        ]}>
        <View style={styles.draggableArea} {...panResponder.panHandlers}>
          <Text
            style={{
              color: 'orange',
              fontSize: 18,
              fontWeight: 'bold',
              paddingBottom: 15,
            }}>
            {t('choice-the-date')}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '95%',
                height: 60,
                backgroundColor: colors.special,
                borderRadius: 10,
              }}>
              <View style={{width: '33%'}}>
                <Text style={{fontSize: 14, color: colors.icon}}>
                  {t('check-in')}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  12:00, {formatDayShow(start)}
                </Text>
              </View>
              <Icon4 name="long-arrow-alt-right" size={25} color="orange" />
              <View style={{width: '33%'}}>
                <Text style={{fontSize: 14, color: colors.icon}}>
                  {t('check-out')}
                </Text>
                {end ? (
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    12:00, {formatDayShow(end)}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}></Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Calendar
            markingType={'period'}
            markedDates={{
              [start]: {
                startingDay: true,
                color: '#50cebb',
                textColor: 'white',
              },
              [end]: {endingDay: true, color: '#50cebb', textColor: 'white'},
              ...middle.reduce((acc, cur) => {
                acc[cur] = {
                  startingDay: false,
                  endingDay: false,
                  color: '#70d7c7',
                  textColor: 'white',
                };
                return acc;
              }, {}),
            }}
            onDayPress={day => handleChooseDay(day)}
            hideExtraDays={true}
            minDate={String(minday)}
            theme={{
              backgroundColor: colors.box,
              calendarBackground: colors.box,
              textSectionTitleColor: colors.text,
              dayTextColor: colors.text,
              monthTextColor: colors.text,
              textDisabledColor: '#d9e1e8',
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: 15,
            borderTopWidth: 1,
            borderTopColor: 'gray',
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              handleConfirm();
            }}
            disabled={end == '' ? true : false}
            style={{
              width: '90%',
              height: 40,
              backgroundColor: end == '' ? '#d1bebd' : '#f44336',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 17, fontWeight: 'bold'}}>
              {t('confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Pressable
        style={[styles.bottomSheet1, {backgroundColor: colors.box}]}
        onPress={() => {
          handleOpenCalendar();
        }}>
        <View style={{padding: 15}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{fontSize: 15, fontWeight: 'bold', color: colors.text}}>
                {t('time-booking')}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text
                  style={{
                    color: colors.text,
                    textDecorationStyle: 'dashed',
                    textDecorationLine: 'underline',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  12:00,{' '}
                  {formatDayShow(startTrue) +
                    ' - 12:00, ' +
                    formatDayShow(endTrue)}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.box,
                borderWidth: 1,
                borderColor: 'red',
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'red'}}>
                {t('change-day')}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
      <TouchableOpacity
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          borderWidth: 1,
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.box,
          zIndex: 2,
          right: 5,
          bottom: '20%',
          borderColor: 'white',
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Icon3 name="commenting" size={25} color={colors.primary} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable
            style={{
              justifyContent: 'flex-end',
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            onPress={() => {
              setModalVisible(false);
            }}>
            <View
              style={{
                height: '70%',
                backgroundColor: colors.box,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                alignItems: 'center',
                paddingTop: 5,
              }}>
              <View
                style={{
                  width: '15%',
                  borderRadius: 20,
                  backgroundColor: colors.icon,
                  height: 5,
                  marginTop: 5,
                }}
              />
              <Text
                style={{
                  marginVertical: 10,
                  fontSize: 21,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('rate-this-hotel')}
              </Text>
              <View
                style={{
                  width: '90%',
                  borderRadius: 20,
                  backgroundColor: '#eeeeee',
                  height: 1,
                }}
              />
              <View style={{padding: 20, width: '100%'}}>
                <View
                  style={{
                    height: 100,
                    backgroundColor: colors.special,
                    borderRadius: 15,
                    elevation: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      height: 100,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                      }}
                      source={{
                        uri: image_default,
                      }}
                    />
                    <View
                      style={{
                        marginLeft: 15,
                        height: 80,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: colors.text,
                        }}>
                        {hotelData.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          width: 200,
                          color: colors.icon,
                        }}>
                        {FormatAddress(hotelData.address)}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Icon5 name="star" size={15} color={'orange'} />
                        <Text
                          style={{
                            fontSize: 15,
                            color: colors.primary,
                            marginLeft: 5,
                            fontWeight: 'bold',
                          }}>
                          {TotalStar()}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: colors.icon,
                            marginLeft: 10,
                          }}>
                          {'('}
                          {hotelData.comments.length} {t('review')}
                          {')'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.text,
                }}>
                {t('please-give-your-rate-&-review')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'space-between',
                  width: '55%',
                  marginVertical: 5,
                }}>
                {star.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setStarhotel(item);
                    }}
                    style={{
                      elevation: 15,
                    }}>
                    <Icon5
                      name="star"
                      size={30}
                      color={index + 1 <= starhotel ? 'orange' : 'grey'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={{
                  width: '90%',
                  borderWidth: 1,
                  borderColor: '#f3f6f4',
                  height: 80,
                  textAlignVertical: 'top',
                  backgroundColor: colors.special,
                  borderRadius: 15,
                  marginVertical: 10,
                  padding: 10,
                  color: colors.text,
                }}
                multiline={true}
                onChangeText={text => setRatecontent(text)}
                value={ratecontent}
              />
              <TouchableOpacity
                style={{
                  width: '90%',
                  height: 50,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  marginTop: 10,
                }}
                onPress={() => {
                  handleRating();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  {t('rate-now')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '90%',
                  height: 50,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  marginTop: 20,
                }}
                onPress={() => {
                  setModalVisible(false);
                  setRatecontent('');
                  setStarhotel(0);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  {t('later')}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  RecentlyBox: {
    width: '100%',
    height: 280,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 15,
    shadowColor: 'black',
    marginBottom: 20,
  },
  IMGRecent: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  HeaderBack: {
    width: width,
    height: 70,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: 'white',
    elevation: 10,
    shadowColor: 'black',

    justifyContent: 'space-between',
  },
  HeaderTitle: {
    width: width,
    height: 50,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 1,
    top: 20,
  },
  ViewInfo: {
    position: 'absolute',
    zIndex: 1,
    top: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    shadowColor: 'black',
    alignItems: 'center',
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    height: SHEET_MAX_HEIGHT,
    bottom: -SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT - 15,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 2,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  bottomSheet1: {
    position: 'absolute',
    width: '100%',
    height: SHEET_MAX_HEIGHT,
    bottom: -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  draggableArea: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
});

export default DetailHotel;
