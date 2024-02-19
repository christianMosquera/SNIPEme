import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextStyle,
} from 'react-native';

const ProfileFeed = () => {
  const [selectedFeed, setSelectedFeed] = useState('SnipesOfMe');

  const getTextStyle = (feedName: string): TextStyle => ({
    color: selectedFeed === feedName ? 'white' : 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center' as 'center',
  });

  const renderItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image source={{uri: item.uri}} style={styles.image} />
    </View>
  );

  const dummySnipesOfMe = Array.from({length: 15}, (_, index) => ({
    id: String(index),
    uri: `https://via.placeholder.com/150x150.png?text=Snipe+${index + 1}`,
  }));

  const dummySnipesTaken = Array.from({length: 15}, (_, index) => ({
    id: String(index),
    uri: `https://via.placeholder.com/150x150.png?text=Taken+${index + 1}`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelectedFeed('SnipesOfMe')}>
          <View
            style={
              selectedFeed === 'SnipesOfMe'
                ? styles.selectedButton
                : styles.button
            }>
            <Text style={getTextStyle('SnipesOfMe')}>Snipes of Me</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelectedFeed('SnipesTaken')}>
          <View
            style={
              selectedFeed === 'SnipesTaken'
                ? styles.selectedButton
                : styles.button
            }>
            <Text style={getTextStyle('SnipesTaken')}>Snipes Taken</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={
          selectedFeed === 'SnipesOfMe' ? dummySnipesOfMe : dummySnipesTaken
        }
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'violet',
  },
  //   buttonContainer: {
  //     flexDirection: 'row',
  //     justifyContent: 'space-around',
  //     // padding: 10,
  //   },
  //   button: {
  //     flex: 1,
  //     alignItems: 'center', // Center the text within the button
  //     justifyContent: 'center', // Center the text vertically
  //     // paddingVertical: 8,
  //     height: 50,
  //     // marginBottom: 8,
  //     backgroundColor: 'lightgrey',
  //   },
  //   selectedButton: {
  //     flex: 1,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     paddingVertical: 8,
  //     height: 50,
  //     // marginBottom: 8,
  //     backgroundColor: 'blue',
  //   },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  image: {
    height: 100, // Set a fixed height for the images
    flex: 1,
  },
  //   touchable: {
  //     flex: 1, // Ensure TouchableOpacity stretches
  //   },
  //   buttonText: {
  //     color: 'white',
  //     fontSize: 16, // Set the font size as needed
  //     // Add textAlign if needed (though it should be centered by default)
  //     textAlign: 'center',
  //   },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingVertical: 10, // Padding only at the top and bottom to avoid affecting width
  },

  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Fixed height for the buttons
    backgroundColor: 'black',
    // paddingVertical: 10,
  },

  selectedButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Fixed height for the buttons
    backgroundColor: 'black',
    borderBottomColor: 'white',
    borderBottomWidth: 5.2,
    // paddingVertical: 10,
  },

  touchable: {
    flex: 1, // Ensure TouchableOpacity stretches
    // borderColor: 'red', // Border color for debugging
    // borderWidth: 1, // Border width for debugging
    height: 50, // Fixed height for the buttons
    // paddingVertical: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background for debugging
  },
});

export default ProfileFeed;
