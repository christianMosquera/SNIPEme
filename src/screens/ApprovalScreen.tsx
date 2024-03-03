import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper';
import { Snipe } from '../types/Snipe';

type Props = {
  unapprovedSnipes: Array<Snipe>;
  setUnapprovedSnipes: Function;
};

const ApprovalScreen = (props: Props) => {

  return (<View style={StyleSheet.absoluteFill}>
    <Image style={StyleSheet.absoluteFill} source={{ uri: props.unapprovedSnipes[0].image }} />
    <Text>Unapproved: {props.unapprovedSnipes.length} </Text>
    {/* <Image style={StyleSheet.absoluteFill} src={'file://' + photoPath} alt="captured photo" />
    <Button onPress={() => setPhotoPath(null)} style={{position: 'absolute', bottom: 20, left: 50, alignSelf: 'flex-start', backgroundColor: 'white'}}>
      <Text style={{color: 'black'}}>Retake</Text>
    </Button> */}
    <Button onPress={() => {props.setUnapprovedSnipes([])}} style={{position: 'absolute', bottom: 20, right: 50, alignSelf: 'flex-end', backgroundColor: 'black'}}>
      <Text style={{color: 'white'}}>Post!</Text>
    </Button>
  </View>)
}

export default ApprovalScreen;
