import { Image, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";

export const EmptyFeedScreen = () => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/noFriends.png')}
                style={{width:280, height:430}}
            />
            <Text style={styles.text}>It looks like you don't have any friends...</Text>
            <Text style={styles.text}>Go make some..! It will be fun I promise :)</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        color: "white",
        marginTop: 20
    },
});