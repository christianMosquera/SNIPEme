import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import Post from '../components/Post';
import TopNav from '../components/TopNav';

const postdata = [
    {
        id: 1,
        username: "Soohwan",
        snipername: "Ethan",
        postTime: "9:20PM"
    },
    {
        id: 2,
        username: "Ethan",
        snipername: "Soohwan",
        postTime: "5:22PM"
    },
    {
        id: 3,
        username: "Emma",
        snipername: "Braeden",
        postTime: "1:45PM"
    },
    {
        id: 4,
        username: "Vyom",
        snipername: "Chris",
        postTime: "11:20AM"
    },
];

const HomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.feed} >
            <FlatList
                data={postdata}
                stickyHeaderIndices={[0]}
                ListHeaderComponent={<TopNav/>}
                renderItem={({item}) => <Post key={item.id}postData={item}/>}
            />
        </SafeAreaView>
        <View style={styles.bottom}>
            <View style={styles.buttons}>
                <Text>Home</Text>
                <Text>Snipe</Text>
                <Text>Profile</Text>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161c2d",
    },
    feed: {
        flex: 16,
    },
    text: {
        fontSize: 42,
        color: "white"
    },
    bottom: {
        flex:2,
        backgroundColor:"#acb5dd",
    },
    buttons: {
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        marginTop:16
    }
  });

export default HomeScreen;
