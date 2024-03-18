import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import Post, { ITSnipe } from '../components/Post';
import TopNav from '../components/TopNav';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../firebase';
import { COLORS } from '../assets/Colors';
import { getDownloadURL, ref } from 'firebase/storage';


const HomeScreen = ({navigation}:any) => {
    const [snipes, setSnipes] = useState<ITSnipe[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSnipes = async () => {
        setIsRefreshing(true);
        const q = query(
            collection(FIREBASE_STORE, "Posts"),
            orderBy("timestamp", "desc"),
            where("approved", "==", true)
        );
        const snapshot = await getDocs(q);
        const postData = [];
        
        for (const document of snapshot.docs) {
            const { approved, image, target_id, sniper_id, timestamp } = document.data();
            
            // Get sniper username
            const sniperDoc = await getDoc(doc(FIREBASE_STORE, "Users", sniper_id));
            const sniper_username = sniperDoc.exists() ? sniperDoc.data().username : null;
            
            // Get target username
            const targetDoc = await getDoc(doc(FIREBASE_STORE, "Users", target_id));
            const target_username = targetDoc.exists() ? targetDoc.data().username : null;

            // Get snipe image url
            const storageRef = ref(FIREBASE_STORAGE, image);
            const image_url = await getDownloadURL(storageRef);
            
            postData.push({
                approved,
                image: image_url,
                timestamp,
                sniper_id,
                sniper_username,
                target_id,
                target_username,
                id: document.id
            });
        }
    
        setSnipes(postData);
        setIsRefreshing(false);
    };
    
    useEffect(() => {
        fetchSnipes();
    }, [])

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.feed} >
                <FlatList
                    data={snipes}
                    stickyHeaderIndices={[0]}
                    ListHeaderComponent={<TopNav/>}
                    renderItem={({item}) => <Post key={item.id} snipe={item} navigation={navigation}/>}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={fetchSnipes}
                            colors={["#ffffff"]}
                            tintColor={"#ffffff"}
                        />
                    }
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND
        // backgroundColor: "#562e2e",
    },
    feed: {
        flex: 16,
        marginHorizontal:12
    },
    text: {
        fontSize: 42,
        color: "white"
    },
    buttons: {
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        marginTop:16
    }
  });

export default HomeScreen;
