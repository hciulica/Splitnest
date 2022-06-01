import React, { useState, useEffect, useRef } from "react";
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   TouchableHighlight,
   Text,
   View,
   Animated,
   Image,
} from "react-native";

import TouchableWithAnimation from "../components/TouchableWithAnimation";
import AddFriendIcon from "../../assets/icons/friendsscreen/addFriendIcon.svg";
import AddedFriendIcon from "../../assets/icons/friendsscreen/AddedFriend.svg";

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   arrayUnion,
   arrayRemove,
   serverTimestamp,
   increment,
   autoRefresh,
   Timestamp,
} from "firebase/firestore";

import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from "react-native-popup-menu";

import { authentication, db } from "../api/firebase/firebase-config";

import ThreeDotsMenu from "../components/ThreeDotsMenu";

export default function FriendCard({
   username,
   mail,
   image,
   added,
   onPress,
   cardType,
   phone,
   autoRefresh,
}) {
   const [pressed, setPressed] = useState(true);
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      const checkIfAdded = async () => {
         const refFriends = doc(db, "Users", authentication.currentUser.email);
         const docFriends = await getDoc(refFriends);

         if (docFriends.exists()) {
            const refFriend = docFriends.data().Friends;
            if (refFriend)
               for (let i = 0; i < refFriend.length; i++) {
                  const docFriendAccount = await getDoc(refFriend[i]);
                  if (mail === docFriendAccount.id) {
                     setPressed(false);
                     break;
                  }
               }
         }
      };
      checkIfAdded();
   }, []);

   const addNewFriendFirestore = async () => {
      try {
         const refUserFriends = doc(
            db,
            "Users",
            authentication.currentUser.email
         );
         const refFriendFriends = doc(db, "Users", mail);
         // Account: {
         //    username: username,
         //    phone: parseInt(phone, 10),
         //    numberFriends: 0,
         // },
         if (pressed) {
            await updateDoc(refUserFriends, {
               "Account.numberFriends": increment(1),
               Friends: arrayUnion(refFriendFriends),
            });

            await updateDoc(refFriendFriends, {
               "Account.numberFriends": increment(1),
               Friends: arrayUnion(refUserFriends),
            });
         }
      } catch (err) {
         console.log(err);
      }
   };

   const addFriend = () => {
      if (pressed) {
         addNewFriendFirestore();
         setPressed(false);
      }
   };

   return (
      <TouchableWithAnimation style={styles.containerCard}>
         <Image style={styles.imageProfile} source={{ uri: image }} />

         <View style={{ width: cardType === "AddFriends" ? 200 : 210 }}>
            <Text style={styles.nameStyle}>{username}</Text>
            <Text style={styles.mailStyle}>{mail}</Text>
         </View>
         {cardType === "AddFriends" ? (
            <TouchableWithAnimation
               style={{ alignContent: "flex-end" }}
               onPress={() => addFriend()}
            >
               {pressed ? <AddFriendIcon /> : <AddedFriendIcon />}
            </TouchableWithAnimation>
         ) : null}
         {cardType === "friends" ? (
            <ThreeDotsMenu
               phone={phone}
               mail={mail}
               username={username}
               autoRefresh={autoRefresh}
            />
         ) : null}
      </TouchableWithAnimation>
   );
}

const styles = StyleSheet.create({
   containerCard: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: 15,
      width: 325,
      height: 57,
      backgroundColor: "white",
      borderRadius: 15,
   },
   textContainer: {
      width: 200,
   },
   request: {
      fontSize: 8,
      marginRight: 10,
   },
   imageProfile: {
      width: 40,
      height: 40,
      borderRadius: 10,
      marginHorizontal: 20,
      overflow: "hidden",
   },

   nameStyle: {
      fontSize: 13,
      fontWeight: "800",
   },

   mailStyle: {
      marginTop: 5,
      fontSize: 9,
      color: "rgba(0,0,0,0.60)",
   },
});
