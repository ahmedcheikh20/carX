import { AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Platform, PlatformSafeAreaView, Button, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshControl, SafeAreaView, Image } from 'react-native';
import tailwind from "tailwind-rn";
import moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App({ user }) {



  const [refreshing, setRefreshing] = useState(false);
  const [id, setID] = useState(null)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false)

      schedulePushNotification();

    })
  }, []);


  const handleConfirm = (id) => {
    console.log(id, 'here the id')
    setID(id)
    setConfirm(true)
  }


  const handleCancel = (id) => {
    setID(id)
  }


  return (
    <>
      {/* <SafeAreaView >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
          </View>
        </ScrollView>
      </SafeAreaView> */}


      <SafeAreaView style={tailwind('h-full')}>
        <View style={tailwind(' pt-2 items-center ')}>
          <View style={[{ justifyContent: "center", alignContent: 'center', padding: 10 }, tailwind('flex flex-row mt-16 ml-4')]} >
            <Image source={require("../../../assets/MainLogo.png")} />
          </View>


          <ScrollView style={tailwind('h-5/6   min-w-full rounded-2xl flex ')}>

            {user.requests.map((e, i) => {
              return (

                <View key={i} style={[{ justifyContent: 'center', alignContent: 'center' }, tailwind('my-2')]} >
                  <LinearGradient colors={['#0857C1', '#4398F8']} style={[{ borderRadius: 26 }, tailwind(' m-2 p-4 items-start  flex ')]}>

                    <Text style={tailwind('  text-black ml-4')}>{"Request number : " + e.id || 'Wash service '}</Text>
                    <Text style={tailwind('  text-white ml-4')}>{`Type of car :  ${e.typeOfCar}`}</Text>
                    <Text style={tailwind('  text-white ml-4')}>{`Type of wash : ${e.typeOfWash}`}</Text>
                    <Text style={tailwind('  text-white ml-4')}>{`Time estimated : ${e.duration || "we'll connect you soon"}`}</Text>
                    <Text style={tailwind('  text-white ml-4')}>{`agent name: ${e.worker == null ? "we'll contact you soon" : e.worker.name}`}</Text>
                    <Text style={tailwind('  text-white ml-4  ')}>{`Price : ${e.Price + " DT" || "we'll connect you soon"}`}</Text>
                    <View style={tailwind(' text-white ml-4 bg-red-500 rounded text-center border-opacity-40 flex-row')}>

                    </View>
                  </LinearGradient>


                  <View style={{ marginLeft: -10, marginTop: 10, flexDirection: "row", justifyContent: "space-evenly" }} >

                    <TouchableOpacity style={[{ justifyContent: 'center', alignSelf: 'center' }, tailwind('flex flex-row')]}>

                      <View style={[{ justifyContent: 'center', alignContent: 'center', borderWidth: 1, borderRadius: 40, borderColor: '#4398F8', height: 40, width: 120 }, tailwind('flex flex-row')]}>
                        <Text style={{ color: '#828282', alignSelf: 'center' }}>Cancel</Text>
                      </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleConfirm(e.id)} disabled={e.worker == null ? true : false} >
                      <LinearGradient colors={['#0857C1', '#4398F8']} start={{ x: 1, y: 0.9 }} style={[{ justifyContent: 'center', alignContent: 'center', borderRadius: 40, height: 40, width: 220 }, tailwind('flex flex-row')]}>

                        <View style={[{ justifyContent: 'space-around', alignItems: 'center' }, tailwind('flex flex-row')]}>
                          <Text style={[{ justifyContent: 'center', color: 'white' }, tailwind('ml-4 mx-4')]} >Confirm and Pay</Text>
                          <Image style={[{ width: 34, height: 15 }, tailwind('mr-4 mt-1 mx-4 ')]} source={require("../../../assets/Arrow1.png")} />
                        </View>

                      </LinearGradient>
                    </TouchableOpacity>

                  </View>

                </View>
              )

            })
            }

          </ScrollView>
        </View>
      </SafeAreaView>

    </>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Request  📬",
      body: 'request was accepted',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});