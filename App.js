import 'react-native-gesture-handler';
import React, {Component, useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
// import {createAppContainer} from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, forFade, forVerticalIOS,forModalPresentationIOS , TransitionPresets} from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CameraScreen from './src/screens/CameraScreen';
import TestScreen from './src/screens/TestScreen';
// import IntroductionScreen from './src/screens/IntroductionScreen';
import OnboardScreen from './src/screens/OnboardScreen';
import {LogBox} from 'react-native';
import {YellowBox} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

import authentication from './src/api/firebase/firebase-config';

const persistConfig = {
   key: 'root',
   storage: AsyncStorage,
   blacklist: [],
};

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

LogBox.ignoreLogs([
  '[@react-native-async-storage/async-storage Warning: Async Storage has been extracted from react-native core',
]);


const Stack = createStackNavigator();

const App = () => {
  const [isAppFirstLaunched, setisAppFirstLaunched] = React.useState(null);
  const [emailRememberedCredentials, setEmailRememberedCredentials] = useState(null);
  const [passwordRememberedCredentials, setPasswordRememberedCredentials] = useState(null);
  const [isRemembered, setIsRemembered] = useState(null);

  const fetchAsyncStorage = async() => {
    const appData = await AsyncStorage.getItem("isAppFirstLaunched");
    
    console.log(appData);
    if(appData == null){
      setisAppFirstLaunched(true);
      //AsyncStorage.setItem('isAppFirstLaunched', 'false');
    } else {
      setisAppFirstLaunched(false);
    }
  }

  const fetchRememberedCredentials = async() => {
    const emailRemembered = await AsyncStorage.getItem("email");
    const passwordRemembered = await AsyncStorage.getItem("password");
    setEmailRememberedCredentials(emailRemembered);
    setPasswordRememberedCredentials(passwordRemembered);
  }

  const animationAfterLogin = async() => {
    // var test = false;
    const emailRemembered = await AsyncStorage.getItem("email");
    const passwordRemembered = await AsyncStorage.getItem("password");

    if(emailRemembered === null && passwordRemembered === null)
    {
        setIsRemembered(true);
      
    }
    else
      
      setIsRemembered(false);
      
  }

  React.useEffect(() => {
    fetchAsyncStorage();
    animationAfterLogin();
    //console.log("Animation", animationAfterLogin());
  }, []);

  return (
    isAppFirstLaunched != null && (
    <NavigationContainer>
      <Stack.Navigator>
        {isAppFirstLaunched && (
          <Stack.Screen component={OnboardScreen} name = "Onboard" options={{headerShown:false, cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS}}/>
        )}
        <Stack.Screen component={LoginScreen} name = "Login" options={{headerShown:false, gestureEnabled:false, animationTypeForReplace: 'pop'}}/>     
        <Stack.Screen component={RegisterScreen} name = "Register" options={{headerShown:false}}/>       
        <Stack.Screen component={CameraScreen} name = "Camera" options={{headerShown:false, animationEnabled: false}}/>    
       </Stack.Navigator>
    </NavigationContainer>
    )
  )
   // <Text>CEVA</Text>
    
  
  //return <Main/>
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