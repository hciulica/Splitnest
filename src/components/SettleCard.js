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

import { authentication, db } from "../api/firebase/firebase-config";

const SettleCard = ({ style, name, email, image, sumPay, handlePress }) => {
   useEffect(() => {}, []);

   return (
      <TouchableWithAnimation
         duration={150}
         pressAnimation={0.97}
         onPress={handlePress}
      >
         <View style={[styles.containerCard, style]}>
            <Image style={styles.imageStyle} source={{ uri: image }} />
            <View style={{ marginLeft: 20, width: 155 }}>
               <Text style={styles.nameStyle}>{name}</Text>
               <Text style={styles.emailStyle}>{email}</Text>
            </View>

            <View style={{ alignItems: "center" }}>
               <Text style={styles.totalStyle}>Total</Text>
               <Text style={styles.priceStyle}>{sumPay}RON</Text>
            </View>
         </View>
      </TouchableWithAnimation>
   );
};

const styles = StyleSheet.create({
   containerCard: {
      width: 336,
      height: 79,
      borderRadius: 15,
      backgroundColor: "white",
      alignItems: "center",
      flexDirection: "row",
   },
   imageStyle: {
      width: 50,
      height: 50,
      borderRadius: 10,
      marginLeft: 25,
   },
   nameStyle: {
      fontSize: 13,
      fontWeight: "800",
      color: "black",
   },
   emailStyle: {
      fontSize: 9,
      fontWeight: "500",
      color: "rgba(0,0,0,0.40)",
      marginTop: 5,
   },
   totalStyle: {
      fontWeight: "900",
      fontSize: 14,
      color: "rgba(255,97,87,1)",
   },
   priceStyle: {
      fontWeight: "bold",
      fontSize: 11,
      color: "rgba(255,97,87,1)",
   },
});

export default SettleCard;
