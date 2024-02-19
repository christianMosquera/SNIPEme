import React from 'react';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const ArrowHeader = () => {
  const navigation = useNavigation();

  return (
    <IconButton
      icon="chevron-left"
      onPress={() => navigation.goBack()}
      iconColor="white"
      size={40}
    />
  );
};

export default ArrowHeader;
