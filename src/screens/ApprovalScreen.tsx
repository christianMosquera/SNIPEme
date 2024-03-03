import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper';
import { Snipe } from '../types/Snipe';

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

  return (
  <View style={StyleSheet.absoluteFill}>
    <Image style={StyleSheet.absoluteFill} source={{ uri: props.unapprovedSnipes[0].image }} />
    <Button onPress={() => {}} style={{position: 'absolute', bottom: 20, left: 50, alignSelf: 'flex-start', backgroundColor: 'white'}}>
      <Text style={{color: 'black'}}>Reject</Text>
    </Button>
    <Button onPress={() => {props.setUnapprovedSnipes([])}} style={{position: 'absolute', bottom: 20, right: 50, alignSelf: 'flex-end', backgroundColor: 'black'}}>
      <Text style={{color: 'white'}}>Approve!</Text>
    </Button>
  </View>)
}

export default ApprovalScreen;
