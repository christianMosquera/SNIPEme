import React from 'react';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../types/ProfileStackParamList';

const PlusHeader = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  return (
    <IconButton
      icon="plus"
      onPress={() => navigation.navigate('AddFriend')}
      iconColor="white"
      size={40}
    />
  );
};

export default PlusHeader;
