import "react-native-gesture-handler";
import React, { Component, useState, useEffect, createContext } from "react";
import {
   View,
   Text,
   Image,
   StyleSheet,
   SafeAreaView,
   TouchableOpacity,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import {
   createStackNavigator,
   CardStyleInterpolators,
   forFade,
   forVerticalIOS,
   forModalPresentationIOS,
   TransitionPresets,
} from "@react-navigation/stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TabNavigator from "./src/navigation/TabNavigator";
import SettingsScreen from "./src/screens/SettingsScreen";
import OnboardScreen from "./src/screens/OnboardScreen";
import AddExpenseScreen from "./src/screens/AddExpenseScreen";
import AddFriendScreen from "./src/screens/AddFriendScreen";
import CreateGroupScreen from "./src/screens/CreateGroupScreen";
import InviteFriendsScreen from "./src/screens/InviteFriendsScreen";
import GroupIndividualScreen from "./src/screens/GroupIndividualScreen";
import PayerScreen from "./src/screens/PayerScreen";
import SplitScreen from "./src/screens/SplitScreen";
import ConfirmPayScreen from "./src/screens/ConfirmPayScreen";
import AboutScreen from "./src/screens/AboutScreen";

import { LogBox } from "react-native";
import { YellowBox } from "react-native";

import { MenuProvider } from "react-native-popup-menu";

import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "./src/AppContext";

import authentication from "./src/api/firebase/firebase-config";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

const persistConfig = {
   key: "root",
   storage: AsyncStorage,
   blacklist: [],
};

LogBox.ignoreLogs([
   "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

LogBox.ignoreLogs([
   "[@react-native-async-storage/async-storage Warning: Async Storage has been extracted from react-native core",
]);

LogBox.ignoreLogs([
   "Non-serializable values were found in the navigation state",
]);

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

const App = () => {
   const [isAppFirstLaunched, setIsAppFirstLaunched] = React.useState(null);
   const [isRemembered, setIsRemembered] = useState(null);
   const [imageAccount, setImageAccount] = useState("");

   const userSettings = {
      imageAccount: imageAccount,
      setImageAccount,
   };

   const fetchAsyncStorage = async () => {
      const appData = await AsyncStorage.getItem("isAppFirstLaunched");

      console.log(appData);
      if (appData == null) {
         setIsAppFirstLaunched(true);
      } else {
         setIsAppFirstLaunched(false);
      }
   };

   const fetchRemembered = async () => {
      // var test = false;
      const emailRemembered = await AsyncStorage.getItem("email");
      const passwordRemembered = await AsyncStorage.getItem("password");

      if (emailRemembered === null && passwordRemembered === null)
         setIsRemembered(true);
      else setIsRemembered(false);
   };

   const disabledPassword = async () => {
      AsyncStorage.setItem("disabledChangePassword", "false");
   };

   useEffect(() => {
      fetchAsyncStorage();
      fetchRemembered();
      disabledPassword();
   }, []);

   return (
      isAppFirstLaunched != null && (
         <MenuProvider>
            <NavigationContainer>
               <Stack.Navigator>
                  {isAppFirstLaunched && (
                     <Stack.Screen
                        component={OnboardScreen}
                        name="Onboard"
                        options={{
                           headerShown: false,
                           cardStyleInterpolator:
                              CardStyleInterpolators.forModalPresentationIOS,
                        }}
                     />
                  )}
                  <Stack.Screen
                     component={LoginScreen}
                     name="Login"
                     options={{
                        headerShown: false,
                        gestureEnabled: false,
                        animationTypeForReplace: "pop",
                     }}
                  />
                  <Stack.Screen
                     component={RegisterScreen}
                     name="Register"
                     options={{
                        headerShown: false,
                     }}
                  />
                  <Stack.Screen
                     component={TabNavigator}
                     name="Tab"
                     options={{
                        headerShown: false,
                        gestureEnabled: false,
                        animationEnabled: false,
                     }}
                  />
                  <Stack.Screen
                     component={AboutScreen}
                     name="About"
                     options={{ headerShown: false, gestureEnabled: true }}
                  />
                  <Stack.Screen
                     component={SettingsScreen}
                     name="Settings"
                     options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                     component={InviteFriendsScreen}
                     name="InviteFriends"
                     options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                     component={AddFriendScreen}
                     name="AddFriend"
                     options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                     component={CreateGroupScreen}
                     name="CreateGroup"
                     options={{
                        headerShown: false,
                        gestureDirection: "vertical",
                        cardStyleInterpolator:
                           CardStyleInterpolators.forVerticalIOS,
                        animationTypeForReplace: "pop",
                     }}
                  />
                  <Stack.Screen
                     component={GroupIndividualScreen}
                     name="GroupIndividual"
                     options={{
                        headerShown: false,
                     }}
                  />
                  <Stack.Screen
                     component={ConfirmPayScreen}
                     name="ConfirmPay"
                     options={{
                        headerShown: false,
                     }}
                  />
                  <Stack.Screen
                     component={AddExpenseScreen}
                     name="Add"
                     gestureDirection="horizontal-inverted"
                     options={{
                        tabBarStyle: { display: "none" },
                        headerShown: false,
                        gestureDirection: "vertical",
                        animationTypeForReplace: "pop",
                     }}
                  />
                  <Stack.Screen
                     component={PayerScreen}
                     name="Payer"
                     options={{
                        tabBarStyle: { display: "none" },
                        headerShown: false,
                        gestureDirection: "vertical",
                     }}
                  />
                  <Stack.Screen
                     component={SplitScreen}
                     name="Split"
                     options={{
                        tabBarStyle: { display: "none" },
                        headerShown: false,
                        gestureDirection: "vertical",
                     }}
                  />
               </Stack.Navigator>
            </NavigationContainer>
         </MenuProvider>
      )
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

export default App; //createAppContainer(navigator);
