import {StyleSheet, Text, View, ScrollView, RefreshControl} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {getAsyncStorage} from '../../../../../functions/asyncStorageFunctions';
import NotifyItem from './components/NotifyItem';
import {ContextNotify} from '../ContextNotify';

const AllPage = () => {
  const [notify, setNotify] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getNotify = async () => {
      let notify = await getAsyncStorage('notify');
      setNotify(JSON.parse(notify));
    };
    getNotify();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    let notify = await getAsyncStorage('notify');
    setNotify(JSON.parse(notify));
    console.log('notify', notify);

    setRefreshing(false);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      style={{
        flex: 1,
      }}>
      {notify.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <View
          style={{
            padding: 10,
            backgroundColor: 'white',
            width: '95%',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
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
                  <ContextNotify.Provider value={{notify, setNotify}}>
                    <NotifyItem id={item.id || item?.messageId} />
                  </ContextNotify.Provider>
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
