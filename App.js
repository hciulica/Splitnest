import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './src/screens/LoginScreen';
import CameraScreen from './src/screens/CameraScreen';
import {LogBox} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {YellowBox} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import authentication from './src/api/firebase/firebase-config';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

LogBox.ignoreLogs([
  'Warning: Async Storage has been extracted from react-native core',
]);

const App: () => Node = () => {
  Icon.loadFont();
  return (
    <View style={{marginTop: 60, marginLeft: 10}}>
      <Image
        style={styles.logo}
        source={require('./assets/images/SplitLogo.svg')}
      />
      <Text style={styles.titleBig}>Splitnest</Text>

      {/* <LoginScreen> </LoginScreen> */}
      <CameraScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  titleBig: {
    fontSize: 80,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default App;
