import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CameraScreen from './src/screens/CameraScreen';
import TestScreen from './src/screens/TestScreen';
import {LogBox} from 'react-native';
import {YellowBox} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import authentication from './src/api/firebase/firebase-config';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

LogBox.ignoreLogs([
  'Warning: Async Storage has been extracted from react-native core',
]);


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={LoginScreen} name = "Login" options={{headerShown:false}}/>
        <Stack.Screen component={Main} name = "Main" options={{headerShown:false}}/>
        <Stack.Screen component={Home} name = "Home" options={{headerShown:false}}/>
        <Stack.Screen component={RegisterScreen} name = "Register" options={{headerShown:false}}/>
        <Stack.Screen component={CameraScreen} name = "Camera" options={{headerShown:false}}/>
        <Stack.Screen component={TestScreen} name = "Test" options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
  //return <Main/>
}

const Main: () => Node = ({navigation}) => {
  Icon.loadFont();
  return (
    
      <View style={{marginTop: 60, marginLeft: 10}}> 
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.titleBig}>Splitnest</Text>
        </TouchableOpacity>
        {/* <LoginScreen> </LoginScreen> */}

        {/* <CameraScreen /> */}
      </View>
  );
};

const Home = () => {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>Home Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  titleBig: {
    fontSize: 80,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default App;//createAppContainer(navigator);