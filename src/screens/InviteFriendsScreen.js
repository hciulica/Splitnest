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

const { width, height } = Dimensions.get("window");
const user = authentication.currentUser;

const InviteFriendsScreen = ({ navigation }) => {
   const [numberAdded, setNumberAdded] = useState(0);
   const [friendsAdded, setFriendsAdded] = useState([]);
   const [clear, setClear] = useState(false);

   const friends = useFriendsList();

   const backHandle = () => {
      navigation.goBack();
   };

   const addInvited = (item) => {
      setClear(false);
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
      setClear(false);
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
            clear={clear}
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
      setClear(true);
   };

   const display = () => {
      console.log(JSON.stringify(friendsAdded, null, 3));
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
                  marginHorizontal: 65,
               }}
            >
               <Text
                  style={{
                     fontSize: 17,
                     fontWeight: "bold",
                  }}
               >
                  Invite Friends
               </Text>
               <Text
                  style={{
                     fontSize: 12,
                     fontWeight: "500",
                     color: "#979797",
                     marginTop: 10,
                  }}
               >
                  Select friends to invite
               </Text>
            </View>
            {numberAdded !== 0 ? (
               <TouchableWithAnimation
                  onPress={() =>
                     navigation.navigate({
                        name: "CreateGroup",
                        params: { groupParticipants: friendsAdded },
                        merge: true,
                     })
                  }
               >
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
                        Added
                     </Text>
                  </TouchableOpacity>
                  <Text
                     style={{
                        fontSize: 17,
                        fontWeight: "900",
                        marginLeft: 5,
                        color: "#3165FF",
                     }}
                  >
                     {numberAdded}
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
                  {/* <TouchableOpacity onPress={() => clearAdded()}>
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
               {friends.length ? (
                  <FlatList
                     contentContainerStyle={{
                        height:
                           friendsAdded.length !== 0
                              ? 105 * friends.length
                              : 100 * friends.length,
                     }}
                     horizontal={false}
                     data={friends}
                     renderItem={renderItem}
                     keyExtractor={(item) => item.email}
                     showsVerticalScrollIndicator={false}
                     //  alwaysBounceVertical={false}
                  />
               ) : (
                  <ActivityIndicator
                     style={{
                        width: width,
                        alignSelf: "center",
                        height: 400,
                     }}
                     size="large"
                     color="#3165FF"
                  />
               )}
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
