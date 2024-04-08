import { Timestamp } from 'firebase/firestore';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, Icon, IconButton, MD3Colors, Text } from 'react-native-paper';
import { COLORS } from '../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';





const PostDetail = ({route, navigation}: {route:any, navigation:any}) => {
    const { snipe } = route.params;
    const convertTimestamp = (timestamp : Timestamp) => {
        return timestamp.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    const navigateToProfile = (friendId: string) => {
        navigation.push('ProfileHome', {user_id:friendId});
    };
    return (
        <SafeAreaView style={styles.container}>
            <Card>
                <Card.Cover source={{ uri: snipe.image }} style={{height: 495, borderRadius:0}} />
            </Card>
            <View style={styles.details}>
                <View style={styles.sniperOptions}>
                    <Text style={styles.text} onPress={() => navigateToProfile(snipe.sniper_id)}>{snipe.sniper_username}</Text>
                    <Button 
                        mode='contained'
                        buttonColor='white'
                        textColor='black'
                    >
                    Add Friend</Button>
                </View>
                <Text style={styles.date}>{convertTimestamp(snipe.timestamp)}</Text>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.BACKGROUND,
        flex: 1,
        paddingTop: 65,
    },
    text: {
        color: "white",
        fontSize: 18
    },
    details: {
        paddingHorizontal: 15,
        marginTop: 25,
    },
    sniperOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:"center",
        paddingBottom: 24
    },
    date: {
        color: '#c2acac'
    }
  });

export default PostDetail;