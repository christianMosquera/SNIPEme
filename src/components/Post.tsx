import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Icon, IconButton, MD3Colors, Text } from 'react-native-paper';

interface postData {
    id: number;
    username: string;
    snipername: string;
    postTime: string;
  }

const Post = ({postData}:{postData: postData}) => {
    return (
        <Card style={styles.card}>
            <View>
                <Card.Title 
                    titleStyle={styles.title} 
                    title={postData.username} 
                    subtitleStyle={styles.title} 
                    subtitle={`Sniped by ${postData.snipername} • ${postData.postTime}`}
                    leftStyle={{backgroundColor:'#161c2d'}}
                    left={() => <Icon source={'account-circle-outline'} size={40} color='white' />}
                    right={(props) => <IconButton {...props} icon="dots-horizontal" onPress={() => {}} />}
                />
            </View>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        </Card>
    )
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#161c2d',
        marginVertical: 8
    },
    title: {
        color: "white"
    },
  });

export default Post;