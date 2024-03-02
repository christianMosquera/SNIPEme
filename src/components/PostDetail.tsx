import { Timestamp } from 'firebase/firestore';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Icon, IconButton, MD3Colors, Text } from 'react-native-paper';
import { COLORS } from '../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

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


const PostDetail = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>hello!!</Text>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.BACKGROUND,
        flex: 1
    },
    title: {
        color: "white"
    },
  });

export default PostDetail;