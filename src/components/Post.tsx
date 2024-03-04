import {Timestamp} from 'firebase/firestore';
import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Avatar, Button, Card, Icon, IconButton, MD3Colors, Text } from 'react-native-paper';
import { COLORS } from '../assets/Colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../types/StackParamList';


export interface ITSnipe {
  id: string;
  approved: boolean;
  image: string;
  target_id: string;
  target_username: string;
  sniper_id: string;
  sniper_username: string;
  timestamp: Timestamp;
}

const Post = ({snipe, navigation}:{snipe: ITSnipe, navigation: any}) => {
    const convertTimestamp = (timestamp : Timestamp) => {
        const millisecondsAgo = new Date().getTime() - timestamp.toMillis();
        const minutesAgo = Math.floor(millisecondsAgo / (1000 * 60));
    
        if (minutesAgo < 1) {
            return 'Just now';
        }
        else if (minutesAgo >= 10080) {
            return `${Math.floor(((minutesAgo/60)/24)/7)}w`
        }
        else if (minutesAgo >= 1440) {
            return `${Math.floor((minutesAgo/60)/24)}d`
        }
        else if (minutesAgo >= 60) {
            return `${Math.floor(minutesAgo/60)}hr`
        }
        else {
            return `${minutesAgo}m`;
        }
    };
    return (
        <Card style={styles.card}>
            <View>
                <Card.Title
                    titleStyle={styles.title} 
                    title={snipe.target_username} 
                    subtitleStyle={styles.title}
                    subtitle={`Sniped by ${snipe.sniper_username} • ${convertTimestamp(snipe.timestamp)}`}
                    leftStyle={{backgroundColor:COLORS.BACKGROUND}}
                    left={() => <Icon source={'account-circle-outline'} size={40} color='white' />}
                    right={(props) => <IconButton {...props} icon="dots-horizontal" onPress={() => {}} />}
                />
            </View>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Detail', {snipe})}>
                <Card.Cover source={{ uri: snipe.image }} style={{height: 415}} />
            </TouchableWithoutFeedback>
        </Card>
    )
};

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#562e2e',
    backgroundColor: COLORS.BACKGROUND,
    marginVertical: 8,
  },
  title: {
    color: 'white',
  },
});

export default Post;
