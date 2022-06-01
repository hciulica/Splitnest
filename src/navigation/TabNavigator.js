import React, { useState, useEffect, useRef } from "react";
import {
   View,
   Image,
   StyleSheet,
   Text,
   Alert,
   TouchableOpacity,
   Animated,
   Dimensions,
   SafeAreaView,
} from "react-native";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import GroupsScreen from "../screens/GroupsScreen";
import FriendsScreen from "../screens/FriendsScreen";
import AccountScreen from "../screens/AccountScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";

import HomeIconUnfocused from "../../assets/icons/navbar/home-unfocused.svg";
import HomeIconFocused from "../../assets/icons/navbar/home-focused.svg";
import GroupsIconUnfocused from "../../assets/icons/navbar/groups-unfocused.svg";
import GroupsIconFocused from "../../assets/icons/navbar/groups-focused.svg";
import FriendsIconUnfocused from "../../assets/icons/navbar/friends-unfocused.svg";
import FriendsIconFocused from "../../assets/icons/navbar/friends-focused.svg";
import ButtonIcon from "../../assets/icons/navbar/button.svg";

import TabBarButton from "../components/TabBarButton";

import Feather from "react-native-vector-icons/Feather";

import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
   updateProfile,
   signOut,
   deleteUser,
   onAuthStateChanged,
} from "firebase/auth";
import { storage } from "../api/firebase/firebase-config";
import { authentication, db } from "../api/firebase/firebase-config";

import { doc, onSnapshot } from "firebase/firestore";

const homeName = "Home";
const groupsName = "Groups";
const buttonName = "Button";
const friendsName = "Friends";
const accountName = "Account";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const { width, height } = Dimensions.get("window");

const TabNavigator = () => {
   const [imageAccount, setImageAccount] = useState(
      authentication.currentUser.photoURL
   );

   const refAccount = doc(db, "Users", authentication.currentUser.email);
   const unsub = onSnapshot(refAccount, (doc) => {
      setImageAccount(doc.data().Account.image);
   });

   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: "#4674FF",
            tabBarInactiveTintColor: "rgba(0,0,0,0.75)",
            gestureEnabled: false,
            tabBarStyle: {
               alignItems: "center",
               justifyContent: "center",
               position: "absolute",
               borderRadius: 27,
               width: 348,
               height: 74,
               left: (width - 348) / 2,
               bottom: 38,
               shadowColor: "#000",
               shadowOffset: {
                  width: 0,
                  height: 0,
               },
               shadowOpacity: 0.25,
               shadowRadius: 6.68,

               elevation: 11,
            },

            tabBarButton: (props) => <TabBarButton {...props} />,

            tabBarIcon: ({ color, size, focused, navigation }) => {
               let iconName;
               let rn = route.name;

               if (rn == homeName) {
                  if (focused) {
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 40,
                              justifyContent: "space-between",
                              alignItems: "center",
                           }}
                        >
                           <HomeIconFocused fill={color} />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginTop: 8,
                                 fontWeight: "900",
                                 color: "#3165FF",
                              }}
                           >
                              Home
                           </Text>
                        </View>
                     );
                  } else {
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 40,
                              justifyContent: "space-between",
                              alignItems: "center",
                           }}
                        >
                           <HomeIconUnfocused fill={color} />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginTop: 8,
                                 color: "rgba(0, 0, 0, 0.75)",
                              }}
                           >
                              Home
                           </Text>
                        </View>
                     );
                  }
               }

               if (rn == groupsName) {
                  if (focused)
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "space-between",
                           }}
                        >
                           <GroupsIconFocused fill={color} />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginTop: 8,
                                 fontWeight: "900",
                                 color: "#3165FF",
                              }}
                           >
                              Groups
                           </Text>
                        </View>
                     );
                  else
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "space-between",
                           }}
                        >
                           <GroupsIconUnfocused fill={color} />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginTop: 8,
                                 color: "rgba(0, 0, 0, 0.75)",
                              }}
                           >
                              Groups
                           </Text>
                        </View>
                     );
               }

               if (rn == buttonName) return <ButtonIcon fill="#4674FF" />;

               if (rn == friendsName) {
                  if (focused)
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "space-between",
                           }}
                        >
                           <FriendsIconFocused fill={color} />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginTop: 9,
                                 fontWeight: "900",
                                 color: "#3165FF",
                              }}
                           >
                              Friends
                           </Text>
                        </View>
                     );
                  else
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 40,
                              alignItems: "center",
                              justifyContent: "space-between",
                           }}
                        >
                           <FriendsIconUnfocused fill={color} />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginTop: 9,
                                 color: "rgba(0, 0, 0, 0.75)",
                              }}
                           >
                              Friends
                           </Text>
                        </View>
                     );
               }

               if (rn == accountName) {
                  if (!focused)
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 60,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingTop: 7,
                           }}
                        >
                           <Image
                              source={{ uri: imageAccount }}
                              style={{
                                 width: 30,
                                 height: 30,
                                 borderRadius: 100,
                              }}
                           />
                           <Text
                              style={{
                                 fontSize: 8,
                                 marginBottom: 12,
                                 marginTop: 5,
                                 color: "rgba(0, 0, 0, 0.75)",
                              }}
                           >
                              Account
                           </Text>
                        </View>
                     );
                  else
                     return (
                        <View
                           style={{
                              width: 40,
                              height: 60,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingTop: 7,
                           }}
                        >
                           <View
                              borderWidth={2}
                              borderColor="#3165FF"
                              borderRadius={20}
                           >
                              <Image
                                 source={{ uri: imageAccount }}
                                 style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 100,
                                 }}
                              />
                           </View>
                           <Text
                              style={{
                                 fontSize: 8,
                                 fontWeight: "900",
                                 marginBottom: 12,
                                 marginTop: 5,
                                 color: "#3165FF",
                              }}
                           >
                              Account
                           </Text>
                        </View>
                     );
               }
            },
         })}
      >
         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Groups" component={GroupsScreen} />
         {/* 
         <Tab.Screen name="Groups" component={TopBarNavigator} /> */}

         <Tab.Screen
            name="Button"
            component={AddExpenseScreen}
            options={{ tabBarStyle: { display: "none" } }}
         />
         <Tab.Screen name="Friends" component={FriendsScreen} />
         <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
   );

   const styles = StyleSheet.create({
      textTab: {
         fontSize: 9,
      },
   });
};

export default TabNavigator;
