import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {io} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {LOCAL_API_URL} from '../../../api';
import {SendMessage, RecieveMessage} from '../../../middlewares/chat';
import CustomHeader from '../CustomHeader';
import MsgComponent from './MsgComponent';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';

const Chat = ({navigation, route}) => {
  const {hotelData} = route.params;
  const {userData} = useSelector(state => state.global);
  const [currentUser] = useState(userData);
  const {colors} = useTheme();
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(LOCAL_API_URL);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const getMsg = async () => {
      setLoading(true);
      const data = {
        from: currentUser._id,
        to: hotelData._id,
      };
      const response = await RecieveMessage(data);
      if (response.status === 200) {
        setMessages(response.data);
        console.log('response.data', response.data);
        setLoading(false);
      }
    };
    getMsg();
  }, []);

  const handleSendMsg = async msg => {
    socket.current.emit('send-msg', {
      to: hotelData._id,
      from: currentUser._id,
      msg,
    });
    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: {
        text: msg,
      },
    });
    setMessages(msgs);
    setInput('');

    const data = {
      from: currentUser._id,
      fromType: 'user',
      to: hotelData._id,
      toType: hotelData._id === '6442aa5167b30af877e4ee71' ? 'admin' : 'hotel',
      message: msg,
    };

    await SendMessage(data);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', msg => {
        const data = {
          fromSelf: false,
          message: {
            text: msg,
          },
        };
        setArrivalMessage(data);
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  const listViewRef = useRef(null);
  const listViewHeight = useRef(0);

  const checkTime = (time, index) => {
    if (index === 0) {
      return true;
    }
    const prevTime = new Date(messages[index - 1].time);
    const currentTime = new Date(time);
    const diff = currentTime - prevTime;
    return diff > 1800000 ? true : false;
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader
        title={hotelData.name}
        socket={socket.current}
        id={currentUser._id}
      />
      <ImageBackground
        source={require('../../assets/Background.jpg')}
        style={{flex: 1}}>
        {loading ? (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}>
              <Lottie
                source={require('../../assets/animations/92803-loading.json')}
                autoPlay
                loop
              />
            </View>
          </>
        ) : (
          messages.length > 0 && (
            <FlatList
              style={{flex: 1}}
              data={messages}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ref={listViewRef}
              onLayout={e => {
                listViewHeight.current = e.nativeEvent.layout.height;
              }}
              onContentSizeChange={() => {
                listViewRef.current.scrollToEnd({animated: true});
              }}
              renderItem={({item, index}) => {
                return (
                  <MsgComponent
                    msg={item}
                    checkTime={checkTime(item.time, index)}
                  />
                );
              }}
            />
          )
        )}
      </ImageBackground>
      <View
        style={{
          backgroundColor: '#6BC8FF',
          elevation: 5,
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 7,
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          style={{
            width: '80%',
            height: 40,
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 20,
            fontSize: 16,
          }}
          placeholder="Nhập tin nhắn......"
          placeholderTextColor={'black'}
          multiline={true}
          value={input}
          onChangeText={val => setInput(val)}
        />
        <TouchableOpacity
          onPress={() => {
            handleSendMsg(input);
          }}>
          <Icon
            style={{
              fontSize: 30,
              color: 'white',
            }}
            name="md-send"
            type="Ionicons"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
