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
   Dimensions,
} from "react-native";

import TouchableWithAnimation from "../components/TouchableWithAnimation";
import RadioButtonActive from "../../assets/icons/groupsscreen/radioButtonActive.svg";
import RadioButtonInactive from "../../assets/icons/groupsscreen/radioButtonInactive.svg";

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
} from "firebase/firestore";

import {
   Menu,
   MenuOptions,
   MenuOption,
   MenuTrigger,
} from "react-native-popup-menu";

import { authentication, db } from "../api/firebase/firebase-config";

import ThreeDotsMenu from "../components/ThreeDotsMenu";

const { width, height } = Dimensions.get("window");

export default function InviteCard({
   username,
   mail,
   image,
   cardType,
   style,
   add,
   remove,
}) {
   const [imageURL, setImageURL] = useState(image);
   const [selected, setSelected] = useState(false);

   const cardSelected = () => {
      if (!selected) add();
      else remove();
      setSelected(!selected);
   };

   return (
      <View style={[styles.containerCard, style]}>
         <Image style={styles.imageAvatar} source={{ uri: image }}></Image>
         <View style={{ marginLeft: 23, width: 215 }}>
            <Text style={styles.nameStyle}>{username}</Text>
            <Text style={styles.mailStyle}>{mail}</Text>
         </View>
         <TouchableOpacity onPress={() => cardSelected()}>
            {selected ? <RadioButtonActive /> : <RadioButtonInactive />}
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   containerCard: {
      alignItems: "center",
      flexDirection: "row",
      width: 307,
      height: 50,
      backgroundColor: "white",
   },
   imageAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
   },
   nameStyle: {
      marginBottom: 5,
      fontSize: 15,
      fontWeight: "600",
   },
   mailStyle: {
      fontSize: 10,
      color: "rgba(0,0,0,0.60)",
   },
});
