import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   SafeAreaView,
   Button,
   StyleSheet,
   Dimensions,
   Alert,
   TextInput,
   TouchableWithoutFeedback,
   TouchableOpacity,
   FlatList,
   ActivityIndicator,
} from "react-native";

import {
   BallIndicator,
   BarIndicator,
   DotIndicator,
   MaterialIndicator,
   PacmanIndicator,
   PulseIndicator,
   SkypeIndicator,
   UIActivityIndicator,
   WaveIndicator,
} from "react-native-indicators";

import { authentication, db } from "../api/firebase/firebase-config";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
} from "firebase/firestore";

import FlatButton from "../components/FlatButton";
import BackButton from "../components/BackButton";
import InputField from "../components/InputField";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import InviteCard from "../components/InviteCard";
import AvatarAdded from "../components/AvatarAdded";

import CheckIcon from "../../assets/icons/groupsscreen/checkIcon.svg";

import { onAuthStateChanged } from "firebase/auth";
import { storage } from "../api/firebase/firebase-config";
import useFriendsList from "../hooks/useFriendsList";

import {
   getStorage,
   uploadBytes,
   deleteObject,
   ref,
   getDownloadURL,
} from "firebase/storage";

import { CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const user = authentication.currentUser;

const InviteFriendsScreen = ({
   navigation,
   route,
   navigation: { setParams },
}) => {
   const [numberAdded, setNumberAdded] = useState(0);
   const [friendsAdded, setFriendsAdded] = useState([]);
   const [results, setResults] = useState([]);
   const [friendsResults, setFriendsResults] = useState([]);
   const [loadingScreen, setLoadingScreen] = useState(false);

   const setFriends = async () => {
      setLoadingScreen(true);
      let friends = [];
      let friend = {};
      const refFriends = doc(db, "Users", authentication.currentUser.email);
      const docFriends = await getDoc(refFriends);

      if (docFriends.exists()) {
         const refFriend = docFriends.data().Friends;
         if (refFriend)
            for (let i = 0; i < refFriend.length; i++) {
               const docFriendAccount = await getDoc(refFriend[i]);
               if (docFriendAccount.exists()) {
                  friend = {
                     email: docFriendAccount.id,
                     username: docFriendAccount.data().Account.username,
                     image: docFriendAccount.data().Account.image,
                     phone: docFriendAccount.data().Account.phone,
                  };
               }
               friends.push(friend);
            }
      }
      if (route.params?.groupMembers) {
         const friendsNotAdded = friends.filter(
            ({ email, username, image }) =>
               !route.params?.groupMembers.some(
                  (exclude) =>
                     exclude.email === email &&
                     exclude.username === username &&
                     exclude.image === image
               )
         );
         setFriendsResults(friendsNotAdded);
      } else setFriendsResults(friends);
      setLoadingScreen(false);
   };

   const getGroupDataFromUid = async (uid) => {
      setLoadingScreen(true);
      let members = [];
      let member = {};
      const groupRef = doc(db, "Groups", uid);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
         const refMembers = groupSnap.data().Members;

         let members = [];
         let member = {};

         if (refMembers)
            for (let i = 0; i < refMembers.length; i++) {
               const docGroupMembers = await getDoc(refMembers[i]);
               if (docGroupMembers.exists()) {
                  const memberInfo = {
                     email: docGroupMembers.data().Account.email,
                     username: docGroupMembers.data().Account.username,
                     image: docGroupMembers.data().Account.image,
                  };
                  member = memberInfo;
                  member.email = docGroupMembers.id;

                  if (member.email != authentication.currentUser.email)
                     members.push(member);
               }
            }
         setFriendsResults(members);
      } else {
         console.log("No such document");
      }
      setLoadingScreen(false);
   };

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         //setFriends in invite friend from individualGroupScreen or GroupScreen
         if (route.params?.uidGroupFiltered) {
            //And getGroupDataFromUid when you want to filter group members for that expense
            getGroupDataFromUid(route.params?.uidGroupFiltered);
         } else setFriends();
      });
      return unsubscribe;
   }, [route.params?.groupMembers, route.params?.uidGroupFiltered]);

   group = route.params?.groupMembers;

   const backHandle = () => {
      // navigation.goBack();
      navigation.goBack();
   };

   const addInvited = (item) => {
      const friend = {
         username: item.username,
         email: item.email,
         image: item.image,
      };

      friendsAdded.push(friend);
      setFriendsAdded(friendsAdded);
      setNumberAdded(numberAdded + 1);
   };

   const removeInvited = (item) => {
      const friend = {
         username: item.username,
         email: item.email,
         image: item.image,
      };
      setFriendsAdded(
         friendsAdded.filter((friend) => friend.email != item.email)
      );
      setNumberAdded(numberAdded - 1);
   };

   const clearAll = () => {
      setFriendsAdded([]);
      setNumberAdded(0);
   };

   const renderItem = ({ item }) => {
      return (
         <InviteCard
            style={{ marginTop: 15 }}
            image={item.image}
            username={item.username}
            mail={item.email}
            added={item.added}
            add={() => addInvited(item)}
            remove={() => removeInvited(item)}
            // checked={(state) => console.log(state)}
            radioButtonActive
         />
      );
   };

   const addedItem = ({ item }) => {
      return (
         <AvatarAdded
            style={{ marginRight: 19 }}
            image={item.image}
            remove={() => removeInvited(item)}
         />
      );
   };

   const clearAdded = () => {
      setFriendsAdded([]);
      setNumberAdded(0);
   };

   const display = () => {
      console.log(JSON.stringify(friendsAdded, null, 3));
   };

   const handleConfirm = () => {
      console.log();
      if (route.params?.uidGroupFiltered) {
         route.params?.onPlaceChosen({
            groupFiltered: friendsAdded,
         }),
            navigation.goBack();
      } else {
         navigation.navigate({
            name: route.params?.groupMembers
               ? "GroupIndividual"
               : // : route.params?.uidGroupFiltered
                 // ? "Add"
                 "CreateGroup",
            params: route.params?.groupMembers
               ? { groupInvited: friendsAdded }
               : // : route.params?.uidGroupFiltered
                 // ? { groupFiltered: friendsAdded }
                 { groupParticipants: friendsAdded },
            merge: true,
         });
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <View
            style={{
               alignSelf: "flex-start",
               justifyContent: "space-between",
               flexDirection: "row",
               marginTop: 20,
               alignItems: "center",
            }}
         >
            <BackButton
               style={{ marginLeft: 26 }}
               onPress={() => backHandle()}
            />
            <View
               style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: route.params?.uidGroupFiltered ? 55 : 65,
               }}
            >
               <Text
                  style={{
                     fontSize: 17,
                     fontWeight: "bold",
                  }}
               >
                  {route.params?.groupMembers
                     ? "Invite Friends"
                     : route.params?.uidGroupFiltered
                     ? "Split expense"
                     : "Add Members"}
               </Text>

               <Text
                  style={{
                     fontSize: 12,
                     fontWeight: "500",
                     color: "#979797",
                     marginTop: 10,
                  }}
               >
                  {route.params?.groupMembers
                     ? "Select friends to invite"
                     : route.params?.uidGroupFiltered
                     ? "Select members from group"
                     : "Select friends to add"}
               </Text>
            </View>
            {numberAdded !== 0 ? (
               <TouchableWithAnimation onPress={() => handleConfirm()}>
                  <CheckIcon />
               </TouchableWithAnimation>
            ) : null}
         </View>

         <View
            style={{
               backgroundColor: "white",
               width: width,
               height: height,
               alignSelf: "flex-end",
               marginTop: 25,
               borderRadius: 30,
            }}
         >
            <View style={styles.containerFriends}>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     marginTop: 20,
                  }}
               >
                  <TouchableOpacity onPress={() => display()}>
                     <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                        {route.params?.groupMembers
                           ? "Invited"
                           : route.params?.uidGroupFiltered
                           ? "Selected"
                           : "Added"}
                     </Text>
                  </TouchableOpacity>
                  <Text
                     style={{
                        fontSize: 17,
                        fontWeight:
                           numberAdded === friendsResults.length
                              ? "900"
                              : route.params?.uidGroupFiltered
                              ? "bold"
                              : "900",
                        marginLeft: 5,
                        color:
                           numberAdded === friendsResults.length
                              ? "#3165FF"
                              : route.params?.uidGroupFiltered
                              ? "black"
                              : "#3165FF",
                     }}
                  >
                     {route.params?.uidGroupFiltered
                        ? numberAdded + "/" + friendsResults.length
                        : numberAdded}
                  </Text>
               </View>
               <FlatList
                  contentContainerStyle={{
                     height: numberAdded <= 0 ? 0 : 70,
                     marginTop: 24,
                  }}
                  horizontal
                  data={friendsAdded}
                  renderItem={addedItem}
                  keyExtractor={(item) => item.email}
                  showsHorizontalScrollIndicator={false}
                  alwaysBounceHorizontal={false}
               />
               <View
                  style={{
                     flexDirection: "row",
                     marginTop: 20,
                     marginBottom: 10,
                     alignItems: "center",
                  }}
               >
                  <Text
                     style={{
                        fontSize: 17,
                        fontWeight: "bold",
                     }}
                  >
                     Your friends
                  </Text>
                  {/* <TouchableOpacity onPress={() => clearAll()}>
                     <Text
                        style={{
                           marginLeft: 180,
                           color: "#3165FF",
                           fontWeight: "bold",
                        }}
                     >
                        Clear
                     </Text>
                  </TouchableOpacity> */}
               </View>
               {!loadingScreen ? (
                  <FlatList
                     contentContainerStyle={{
                        height:
                           friendsAdded.length !== 0
                              ? 115 * friendsResults.length
                              : 100 * friendsResults.length,
                     }}
                     horizontal={false}
                     data={friendsResults}
                     renderItem={renderItem}
                     keyExtractor={(item) => item.email}
                     showsVerticalScrollIndicator={false}
                     alwaysBounceVertical={false}
                  />
               ) : loadingScreen ? (
                  <View
                     style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 30,
                     }}
                  >
                     <MaterialIndicator
                        size={50}
                        color="rgba(49,101,255,0.80)"
                        style={{ marginTop: 230 }}
                     ></MaterialIndicator>
                  </View>
               ) : friendsResults.length === 0 ? (
                  <View
                     style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 30,
                     }}
                  >
                     <Text>No found</Text>
                  </View>
               ) : null}
            </View>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
      //   width: width,
      //   height: height,
   },
   containerFriends: {
      marginLeft: 34,
   },
});

export default InviteFriendsScreen;
