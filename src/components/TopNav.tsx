import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {IconButton, MD3Colors, Text} from 'react-native-paper';
import {HomeStackParamList} from '../types/HomeStackParamList';
import {useContext} from 'react';
import {NotifContext} from '../navigation/AppStack';

const TopNav = () => {
  const [newNotif, setNewNotif] = useContext(NotifContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return (
    <View style={styles.nav}>
      <IconButton
        icon={'account-plus'}
        size={30}
        iconColor={MD3Colors.neutral90}
        onPress={() => navigation.navigate('AddFriendHome')}
      />
      <Text style={styles.title}>SNIPEME</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        <IconButton
          icon={newNotif ? 'bell-badge' : 'bell'}
          iconColor={newNotif ? MD3Colors.error60 : MD3Colors.neutral90}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default TopNav;
