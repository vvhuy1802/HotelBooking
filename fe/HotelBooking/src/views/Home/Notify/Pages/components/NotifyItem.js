import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {ContextNotify} from '../../ContextNotify';
import {setAsyncStorage} from '../../../../../../functions/asyncStorageFunctions';

const NotifyItem = ({id}) => {
  const [isShow, setIsShow] = useState(false);
  const {notify, setNotify} = useContext(ContextNotify);

  const {title, body, time, sentTime, data, notification} = notify.find(
    item => item.id === id || item.messageId === id,
  );

  const formatTime = time => {
    const momentObj = moment(time);

    if (moment().diff(momentObj, 'minutes') < 1) {
      return 'Vừa xong';
    } else if (moment().diff(momentObj, 'minutes') < 60) {
      const minutesAgo = moment().diff(momentObj, 'minutes');
      return `${minutesAgo} phút trước`;
    } else if (moment().diff(momentObj, 'hours') < 24) {
      const hoursAgo = moment().diff(momentObj, 'hours');
      return `${hoursAgo} tiếng trước`;
    } else {
      const formattedDate = momentObj.format('dddd, DD/MM');
      return formattedDate;
    }
  };

  const handleMarkAsRead = id => {
    const index = notify.findIndex(
      item => item.id === id || item.messageId === id,
    );
    const newNotify = [...notify];
    newNotify[index].data.isRead = 'true';
    setNotify(newNotify);
    setAsyncStorage('notify', JSON.stringify(newNotify));
    setIsShow(false);
  };

  const handleDeleteNotify = id => {
    const index = notify.findIndex(
      item => item.id === id || item.messageId === id,
    );
    const newNotify = [...notify];
    newNotify.splice(index, 1);
    setNotify(newNotify);
    setAsyncStorage('notify', JSON.stringify(newNotify));
    setIsShow(false);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
      }}>
      <View>
        <Image
          source={require('../../../../../assets/avtvk.jpg')}
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            marginTop: 2,
          }}
        />
        {data.isRead === 'false' && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 25,
              backgroundColor: 'white',
              position: 'absolute',
              right: -2,
              top: -2,
            }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 5,
                backgroundColor: 'red',
                position: 'absolute',
                right: 1,
                top: 1,
              }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#000',
            }}>
            {title || notification.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsShow(true);
            }}>
            <Icon name="dots-three-horizontal" size={20} color="#000" />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isShow}
            onRequestClose={() => {
              setIsShow(false);
            }}>
            <Pressable
              onPress={() => {
                setIsShow(false);
              }}
              style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '100%',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  padding: 10,
                  position: 'absolute',
                  bottom: 0,
                }}>
                <View
                  style={{
                    width: '95%',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleMarkAsRead(id);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    }}>
                    <Icon1 name="check" size={20} color="#000" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000',
                        marginLeft: 10,
                      }}>
                      Đánh dấu đã đọc
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleDeleteNotify(id);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    }}>
                    <Icon2 name="delete-outline" size={20} color="#000" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000',
                        marginLeft: 10,
                      }}>
                      Xóa thông báo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <Icon2 name="clear" size={20} color="#000" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000',
                        marginLeft: 10,
                      }}>
                      Hủy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: '#000',
            textAlign: 'justify',
            marginTop: 5,
          }}>
          {body || notification.body}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#000',
            textAlign: 'right',
            marginTop: 5,
          }}>
          {formatTime(time || sentTime)}
        </Text>
      </View>
    </View>
  );
};

export default NotifyItem;

const styles = StyleSheet.create({});
