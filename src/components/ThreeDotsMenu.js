import * as React from "react";
import {
   View,
   Text,
   Linking,
   TouchableHighlight,
   TouchableOpacity,
   Alert,
} from "react-native";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import ThreeDots from "../../assets/icons/friendsscreen/threeDotsIcon.svg";

import Feather from "react-native-vector-icons/Feather";

// somewhere in your app
import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
   NotAnimatedContextMenu,
   SlideInMenu,
} from "react-native-popup-menu";

import { authentication, db } from "../api/firebase/firebase-config";

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   increment,
   arrayRemove,
} from "firebase/firestore";

const ThreeDotsMenu = ({ username, mail, phone, autoRefresh }) => {
   const removeFriend = async () => {
      try {
         const refUserFriends = doc(
            db,
            "Users",
            authentication.currentUser.email
         );
         const refFriendFriends = doc(db, "Users", mail);

         await updateDoc(refUserFriends, {
            "Account.numberFriends": increment(-1),
            Friends: arrayRemove(refFriendFriends),
         });

         await updateDoc(refFriendFriends, {
            "Account.numberFriends": increment(-1),
            Friends: arrayRemove(refUserFriends),
         });

         autoRefresh();
      } catch (err) {
         console.log(err);
      }
   };

   const handleDelete = () => {
      Alert.alert(
         "Remove friend",
         "Are you sure you want to remove " + username + "?",

         [
            { text: "Cancel", style: "cancel" },
            {
               text: "Remove",
               onPress: () => removeFriend(),
               style: "destructive",
            },
         ]
      );
   };

   return (
      <View>
         <Menu>
            <MenuTrigger
               customStyles={{
                  optionWrapper: {
                     justifyContent: "center",
                     alignItems: "center",
                  },
                  OptionTouchableComponent: TouchableWithAnimation,
                  optionText: {
                     fontSize: 30,
                  },
               }}
               children={<ThreeDots />}
            />
            <MenuOptions
               customStyles={{
                  optionWrapper: {
                     padding: 15,
                  },
                  optionsContainer: {
                     width: 120,
                     borderRadius: 10,
                     //  paddingHorizontal: 20,
                     //  paddingVertically: 15,
                  },
               }}
            >
               <MenuOption onSelect={() => Linking.openURL(phone.toString())}>
                  <View
                     style={{
                        alignItems: "center",
                        flexDirection: "row",
                     }}
                  >
                     <Feather name="phone" size={15} />
                     <Text
                        style={{ color: "black", fontSize: 15, marginLeft: 15 }}
                     >
                        Call
                     </Text>
                  </View>
               </MenuOption>
               <MenuOption onSelect={() => handleDelete()}>
                  <View
                     style={{
                        alignItems: "center",
                        flexDirection: "row",
                     }}
                  >
                     <Feather name="user-x" size={15} color="red" />
                     <Text
                        style={{ color: "red", fontSize: 15, marginLeft: 15 }}
                     >
                        Remove
                     </Text>
                  </View>
               </MenuOption>
            </MenuOptions>
         </Menu>
      </View>
   );
};

export default ThreeDotsMenu;
