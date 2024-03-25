import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import Post, { ITSnipe } from '../components/Post';
import TopNav from '../components/TopNav';
import { collection, doc, documentId, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../firebase';
import { COLORS } from '../assets/Colors';
import { getDownloadURL, ref } from 'firebase/storage';
import {UserContext} from '../contexts/UserContext';
import {User} from 'firebase/auth';


const HomeScreen = ({navigation}:any) => {
    const [snipes, setSnipes] = useState<ITSnipe[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currentUser = useContext(UserContext) as User | null;

    const fetchSnipes = async () => {
        setIsRefreshing(true);

        if(!currentUser) return;
        const friendsDoc = await getDoc(doc(FIREBASE_STORE, "Friends", currentUser.uid));
        const friendIds = friendsDoc.exists() ? friendsDoc.data().friends : [];

        const postData = [];

        for (const friendId of friendIds) {
            const q = query(
                collection(FIREBASE_STORE, "Posts"),
                orderBy("timestamp", "desc"),
                where("approved", "==", true),
                where("target_id", "==", friendId)
            );
            const snapshot = await getDocs(q);

            for (const document of snapshot.docs) {
                const { approved, image, target_id, sniper_id, timestamp } = document.data();
                
                // Get sniper username
                const sniperDoc = await getDoc(doc(FIREBASE_STORE, "Users", sniper_id));
                const sniperData = sniperDoc.exists() ? sniperDoc.data() : null;
                const sniper_username = sniperData ? sniperData.username : null;
                const sniper_avatar_url = sniperData ? sniperData.avatar_url : null;
                
                // Get target username
                const targetDoc = await getDoc(doc(FIREBASE_STORE, "Users", target_id));
    
                // Get snipe image url
                const storageRef = ref(FIREBASE_STORAGE, image);
                const image_url = await getDownloadURL(storageRef);
                const targetData = targetDoc.exists() ? targetDoc.data() : null;
                const target_username = targetData ? targetData.username : null;
                const target_avatar_url = targetData ? targetData.avatar_url : null;
                
                postData.push({
                    approved,
                    image: image_url,
                    timestamp,
                    sniper_id,
                    sniper_username,
                    sniper_avatar_url,
                    target_id,
                    target_username,
                    target_avatar_url,
                    id: document.id
                });
            }
        }
        
        setSnipes(postData);
        setIsRefreshing(false);
    };
    
    useEffect(() => {
        fetchSnipes();
    }, [currentUser])

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
        backgroundColor: COLORS.BACKGROUND,
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
