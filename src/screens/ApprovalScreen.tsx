import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import { Button } from 'react-native-paper';
import { Snipe } from '../types/Snipe';
import { FIREBASE_STORAGE, FIREBASE_STORE } from '../../firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

type Props = {
  unapprovedSnipes: Array<Snipe>;
  setUnapprovedSnipes: Function;
};

const ApprovalScreen = (props: Props) => {
  // Keep track of the next snipe to approve
  const [currentSnipe, setCurrentSnipe] = useState<Snipe>(props.unapprovedSnipes.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)[0]);
  useEffect(() => {
    setCurrentSnipe(props.unapprovedSnipes.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)[0]);
  }, [props.unapprovedSnipes]);

  // Keep track of the sniper's name
  const [sniperName, setSniperName] = useState<string>('');
  useEffect(() => {
    // Query the database for the sniper's name
    const userRef = doc(FIREBASE_STORE, "Users", currentSnipe.sniper_id);
    getDoc(userRef).then((result) => {
      if (result.exists()) {
        setSniperName(result.data().username);
      }
    });
  }, [currentSnipe.sniper_id]);

  const approveSnipe = async () => {
    // Set approved to true in the db
    const snipeRef = doc(FIREBASE_STORE, "Posts", currentSnipe.id);

    try {
      await updateDoc(snipeRef, { approved: true });

      // Remove the snipe from the unapprovedSnipes array
      props.setUnapprovedSnipes(props.unapprovedSnipes.filter(snipe => snipe.id !== currentSnipe.id));
    } catch {
      console.log('Error approving snipe');
    }
  }

  const rejectSnipe = async () => {
    // Remove the doc from the db
    const snipeRef = doc(FIREBASE_STORE, "Posts", currentSnipe.id);

    try {
      await deleteDoc(snipeRef);

      deleteObject(ref(FIREBASE_STORAGE, currentSnipe.image));

      // Remove the snipe from the unapprovedSnipes array
      props.setUnapprovedSnipes(props.unapprovedSnipes.filter(snipe => snipe.id !== currentSnipe.id));
    } catch {
      console.log('Error rejecting snipe');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sniped by {sniperName}!</Text>
        <Text style={{color: 'white', fontSize: 16}}>on {new Date(currentSnipe.timestamp.seconds * 1000).toLocaleString('en-US', { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
      </View>
      <ImageBackground source={{ uri: currentSnipe.image_url }} style={styles.image}>
        <View style={styles.buttonContainer}>
          <Button onPress={rejectSnipe} style={{backgroundColor: 'white'}}>
            <Text style={{color: 'black'}}>Reject</Text>
          </Button>
          <Button onPress={approveSnipe} style={{backgroundColor: 'black'}}>
            <Text style={{color: 'white'}}>Approve!</Text>
          </Button>
        </View>
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: 'rgba(100, 100, 100, 0.4)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ApprovalScreen;
