import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import FriendRequest from '../components/FriendRequest';
import {COLORS} from '../assets/Colors';
import { Icon } from 'react-native-paper';
import { UserContext } from '../contexts/UserContext';
import { User } from 'firebase/auth';
import { NotificationCard } from '../components/NotificationCard';
import { RefreshControl } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/HomeStackParamList';

interface NotificationType {
  sender_id: string;
  message_type: string;
  message: string;
}

const NotificationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const currentUser = useContext(UserContext) as User | null;
    const [notifications, setNotifications] = useState<NotificationType[]>([])
    const fetchNotifications = async () => {
        if (!currentUser) return;
        try {
          const userRef = doc(FIREBASE_STORE, 'Notifications', currentUser?.uid);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const fetchedNotifications = doc.data()?.Notifications || [];
              setNotifications(fetchedNotifications);
            }
          });
          return () => unsubscribe();
        } catch (err) {
          console.error("get notification:", err)
        }
    }
    const navigateToProfile = (friendId: string) => {
      navigation.push('ProfileHome', {user_id: friendId});
    };

    useEffect(() => {
        fetchNotifications();
    }, [])
    return (
        <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.push('FriendRequest')}>
          <View style={styles.requestContainer}>
              <Icon source="human-greeting-variant" color='white' size={45}/>
              <View style={styles.textContainer}>
                  <Text style={styles.text}>Follow requests</Text>
                  <Text style={styles.text}>Approve or ignore requests</Text>
              </View>
          </View>
        </TouchableOpacity>
        <View style={styles.notificationContainer}>
            <FlatList
                data={notifications}
                renderItem={({item}) => <TouchableOpacity onPress={() => navigateToProfile(item.sender_id)}><NotificationCard data={item}/></TouchableOpacity>}
            />
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 85,
    backgroundColor: COLORS.BACKGROUND,
  },
  text: {
    color:'white',
    fontSize: 16
  },
  requestContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal:24,
  },
  textContainer: {
    flex: 1,
    marginLeft: 25
  },
  notificationContainer: {
    marginTop: 26,
    paddingHorizontal: 12
  }
});

export default NotificationScreen;
