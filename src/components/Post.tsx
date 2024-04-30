import {Timestamp} from 'firebase/firestore';
import * as React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Icon,
  IconButton,
  MD3Colors,
  Text,
} from 'react-native-paper';
import {COLORS} from '../assets/Colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../types/StackParamList';
import {FIREBASE_STORAGE} from '../../firebase';
import {getDownloadURL, ref} from 'firebase/storage';
import {UserContext} from '../contexts/UserContext';
import {User} from 'firebase/auth';

export interface ITSnipe {
  id: string;
  approved: boolean;
  image: string;
  target_id: string;
  target_username: string;
  target_avatar_url: string;
  sniper_id: string;
  sniper_username: string;
  sniper_avatar_url: string;
  timestamp: Timestamp;
}

const Post = ({
  snipe,
  navigation,
  onPressButton,
}: {
  snipe: ITSnipe;
  navigation: any;
  onPressButton: any;
}) => {
  const currentUser = React.useContext(UserContext) as User | null;
  const [isOwner, setIsOwner] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  const convertTimestamp = (timestamp: Timestamp) => {
    const millisecondsAgo = new Date().getTime() - timestamp.toMillis();
    const minutesAgo = Math.floor(millisecondsAgo / (1000 * 60));

    if (minutesAgo < 1) {
      return 'Just now';
    } else if (minutesAgo >= 10080) {
      return `${Math.floor(minutesAgo / 60 / 24 / 7)}w`;
    } else if (minutesAgo >= 1440) {
      return `${Math.floor(minutesAgo / 60 / 24)}d`;
    } else if (minutesAgo >= 60) {
      return `${Math.floor(minutesAgo / 60)}hr`;
    } else {
      return `${minutesAgo}m`;
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
      console.error('Error getting download URL in Post:', error);
    }
  };

  const navigateToProfile = (friendId: string) => {
    console.log(`Navigating to profile of friend with ID: ${friendId}`);
    navigation.push('ProfileHome', {user_id: friendId});
  };

  const handleOnPress = () => {
    onPressButton({delete: isOwner, postId: snipe.id});
  };

  React.useEffect(() => {
    console.log(snipe.target_avatar_url);
    if (snipe.target_avatar_url) {
      getImageUrl(snipe.target_avatar_url);
    }
    setIsOwner(currentUser?.uid == snipe.sniper_id);
  }, []);
  return (
    <Card style={styles.card}>
      <View>
        <Card.Title
          title={
            <Text
              style={styles.title}
              onPress={() => navigateToProfile(snipe.target_id)}>
              {snipe.target_username}
            </Text>
          }
          subtitleStyle={styles.title}
          subtitle={
            <Text style={styles.subtitle}>
              Sniped by&nbsp;
              <Text
                style={styles.subtitle}
                onPress={() => navigateToProfile(snipe.sniper_id)}>
                {snipe.sniper_username}
              </Text>
              &nbsp;• {convertTimestamp(snipe.timestamp)}
            </Text>
          }
          leftStyle={{backgroundColor: COLORS.BACKGROUND, marginLeft: -10}}
          left={() => {
            return imageUrl == '' ? (
              <Avatar.Icon
                onTouchEnd={() => navigateToProfile(snipe.target_id)}
                size={46}
                icon="account"
                style={{backgroundColor: '#676767'}}
              />
            ) : (
              <Avatar.Image
                onTouchEnd={() => navigateToProfile(snipe.target_id)}
                size={46}
                source={{uri: imageUrl}}
              />
            );
          }}
          right={props => (
            <IconButton
              {...props}
              icon={isOwner ? 'trash-can-outline' : 'alert-circle-outline'}
              onPress={handleOnPress}
            />
          )}
        />
      </View>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('Detail', {snipe})}>
        <Card.Cover source={{uri: snipe.image}} style={{height: 415}} />
      </TouchableWithoutFeedback>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#562e2e',
    backgroundColor: COLORS.BACKGROUND,
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
  },
});

export default Post;
