import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, RefreshControl} from 'react-native';
import Post, { ITSnipe } from '../components/Post';
import TopNav from '../components/TopNav';
import { collection, deleteDoc, doc, documentId, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../firebase';
import { COLORS } from '../assets/Colors';
import { getDownloadURL, ref } from 'firebase/storage';
import {UserContext} from '../contexts/UserContext';
import {User} from 'firebase/auth';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';

interface dialogContent {
    postId:string,
    title:string,
    text:string,
    button:string,
    reason:string
}


const HomeScreen = ({navigation}:any) => {
    const [snipes, setSnipes] = useState<ITSnipe[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currentUser = useContext(UserContext) as User | null;

    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const [dialogContent, setDialogContent] = useState<dialogContent>({postId: "", title:"None", text:"None", button:"None", reason:"None"});

    const fetchSnipes = async () => {
        setIsRefreshing(true);

        if(!currentUser) return;
        const friendsDoc = await getDoc(doc(FIREBASE_STORE, "Friends", currentUser.uid));
        const friendIds = friendsDoc.exists() ? friendsDoc.data().friends : [];
        friendIds.push(currentUser.uid);
        const postData = [];

        const q = query(
            collection(FIREBASE_STORE, "Posts"),
            orderBy("timestamp", "desc"),
            where("approved", "==", true),
            where("target_id", "in", friendIds)
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
        
        setSnipes(postData);
        setIsRefreshing(false);
    };
    
    const handlePostButtonPress = ({delete: isDelete, postId: postId} : {delete:boolean, postId:string}) => {
        setVisible(true);
        let content = {
            "postId": postId,
            "title": "None",
            "text": "None",
            "button": "None",
            "reason": ""
        };
        console.log(isDelete);
        if (isDelete) {
            content = {
                "postId": postId,
                "title": "Delete post?",
                "text": "Are you sure you want to delete your post?",
                "button": "Confirm",
                "reason": "delete"
            }
        } else {
            content = {
                "postId": postId,
                "title": "Report this post?",
                "text": "Reason for report:",
                "button": "Submit",
                "reason": ""
            }
        }
        setDialogContent(content);
    }

    const deletePost = async (postId:string) => {
        try {
            // Reference to the post document
            const postRef = doc(FIREBASE_STORE, "Posts", postId);
    
            // Delete the document
            await deleteDoc(postRef);
    
            console.log("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
        hideDialog();
    };

    const reportPost = (postId:string, reason:string) => {
        console.log(`Post - ${postId} was reported for following reason: \n \"${reason}\"`);
        hideDialog();
    }

    const handleSubmit = () => {
        setIsRefreshing(true);
        if (dialogContent.reason === "delete") deletePost(dialogContent.postId);
        else reportPost(dialogContent.postId, dialogContent.reason);
        fetchSnipes();
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
                    ListHeaderComponent={<TopNav navigation={navigation}/>}
                    renderItem={({item}) => <Post key={item.id} snipe={item} navigation={navigation} onPressButton={handlePostButtonPress}/>}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={fetchSnipes}
                            colors={["#ffffff"]}
                            tintColor={"#ffffff"}
                        />
                    }
                />
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Icon icon="alert" />
                        <Dialog.Title style={styles.dialog}>{dialogContent.title}</Dialog.Title>
                        <Dialog.Content>
                        <Text variant="bodyMedium">{dialogContent.text}</Text>
                        </Dialog.Content>
                        {dialogContent.reason == "delete" ? "" : <TextInput
                            mode='outlined'
                            label="Specify why..."
                            value={dialogContent.reason}
                            onChangeText={reason => setDialogContent((prev) => ({...prev, reason: reason}))}
                        />}
                        <Dialog.Actions>
                        <Button onPress={hideDialog}>Cancel</Button>
                        <Button onPress={handleSubmit}>{dialogContent.button}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
    },
    dialog: {
        textAlign: "center"
    }
  });

export default HomeScreen;
