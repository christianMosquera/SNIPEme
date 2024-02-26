import { StyleSheet, View } from "react-native"
import { IconButton, MD3Colors, Text } from "react-native-paper";

const TopNav = () => {
    return (
        <View style={styles.nav}>
            <IconButton
                icon={'account-plus'} 
                size={30}
                iconColor={MD3Colors.neutral90}
            />
            <Text style={styles.title}>
                SNIPEME
            </Text>
            <IconButton 
                icon={'bell'} 
                iconColor={MD3Colors.neutral90}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    nav: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
        
    },
    title:{
        fontSize:25,
        fontWeight:"bold",
        color: "#ffffff",
    }
  });

export default TopNav;