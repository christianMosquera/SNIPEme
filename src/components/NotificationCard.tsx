import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Card, IconButton} from 'react-native-paper';
import {FIREBASE_STORAGE, FIREBASE_STORE} from '../../firebase';
import {doc, getDoc} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';

interface NotificationType {
  sender_id: string;
  message_type: string;
  message: string;
}

export const NotificationCard = ({data}: {data: NotificationType}) => {
  const {message, message_type, sender_id} = data;
  const [imageUrl, setImageUrl] = React.useState('');

  const getUserImage = async () => {
    const userRef = doc(FIREBASE_STORE, 'Users', sender_id);
    const docSnap = await getDoc(userRef);
    if (docSnap.data()?.avatar_url) {
      const sender_avatar = docSnap.data()?.avatar_url;
      getImageUrl(sender_avatar);
    }
  };

  const getImageUrl = async (avatar_url: string) => {
    const storage = FIREBASE_STORAGE;
    const imageRef = ref(storage, avatar_url);
    try {
      if (imageRef) {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      }
    } catch (error) {
      console.error('Error getting download URL in Notifications:', error);
    }
  };
  getUserImage();
  return (
    <Card.Title
      title={message}
      titleStyle={styles.text}
      left={() => {
        return imageUrl == '' ? (
          <Avatar.Icon size={46} icon="account" />
        ) : (
          <Avatar.Image size={46} source={{uri: imageUrl}} />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 18,
  },
});
