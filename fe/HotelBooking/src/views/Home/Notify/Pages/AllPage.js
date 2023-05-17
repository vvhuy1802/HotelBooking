import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {getAsyncStorage} from '../../../../../functions/asyncStorageFunctions';
import NotifyItem from './components/NotifyItem';
import {ContextNotify} from '../../../../contexts/index';

const AllPage = () => {
  const {notify, setNotify} = useContext(ContextNotify);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    let notify = await getAsyncStorage('notify');
    setNotify(JSON.parse(notify));

    setRefreshing(false);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: '#ddd',
      }}>
      {notify.length === 0 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <Image
            source={require('../../../../assets/no_notify.png')}
            style={{width: 200, height: 200}}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#999',
              marginTop: 20,
            }}>
            Không có thông báo nào
          </Text>
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            backgroundColor: 'white',
            width: '95%',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 10,
          }}>
          {notify
            ?.map((item, index) => {
              return (
                <View
                  key={index + item.id}
                  style={{
                    backgroundColor: 'white',
                    borderBottomWidth: index === 0 ? 0 : 1,
                    borderBottomColor: '#ddd',
                  }}>
                  <NotifyItem id={item.id || item?.messageId} />
                </View>
              );
            })
            .reverse()}
        </View>
      )}
    </ScrollView>
  );
};

export default AllPage;

const styles = StyleSheet.create({});
