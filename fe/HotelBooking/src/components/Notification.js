import {Text, View, Image, Animated, Dimensions, Pressable} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Globalreducer from '../../redux/Globalreducer';

const Notification = () => {

  const {notification} = useSelector(state => state.Globalreducer);
  console.log('Notification', notification);

  const formatLongText = text => {
    if (text.length > 110) {
      return text.slice(0, 110) + '...';
    }
    return text;
  };

  const [isOpen, setIsOpen] = useState(true);
  const translateY = new Animated.Value(0);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    Animated.timing(translateY, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const height = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').height * 0.3],
  });


  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 5,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          zIndex: 100,
        },
        {transform: [{translateY: height}]},
      ]}>
      <Pressable
        onPress={() => {
          console.log('aaa');
        }}
        style={{
          width: '95%',
          backgroundColor: 'white',
          borderRadius: 10,
          alignSelf: 'center',
          elevation: 5,
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
              Thông báo đặt phòng
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
                height: 40,
              }}>
              {formatLongText(
                'Chúng tôi đã nhận được yêu cầu đặt phòng của bạn. Vui lòng chờ Chúng tôi đã nhận được yêu cầu đặt phòng của bạn. Vui lòng chờ',
              )}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Notification;
