import React, { useRef, useState, useEffect } from "react";
import AboutIcon from "../../assets/icons/accscreen/aboutIcon.svg";
import SettingsIcon from "../../assets/icons/accscreen/settingsIcon.svg";
import PaymentsIcon from "../../assets/icons/accscreen/paymentsIcon.svg";
import LogoutIcon from "../../assets/icons/accscreen/logoutIcon.svg";
import RedoIcon from "../../assets/icons/homescreen/redoIcon.svg";
import ArrowIcon from "../../assets/icons/homescreen/arrowCard.svg";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   where,
   orderBy,
} from "firebase/firestore";

import { authentication, db } from "../api/firebase/firebase-config";

import {
   View,
   TouchableWithoutFeedback,
   Animated,
   Text,
   StyleSheet,
   Image,
} from "react-native";

const ActivityCard = ({
   groupUid,
   groupName,
   pay,
   payerRef,
   style,
   onPress,
}) => {
   // const iconSelected = (name === 'about') ? <AboutIcon/>

   const [imagePayer, setImagePayer] = useState(null);
   const [userNamePayer, setUsernamePayer] = useState(null);

   const getInfoPayer = async () => {
      const docRef = doc(db, "Users", payerRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
         setImagePayer(docSnap.data().Account.image);
         setUsernamePayer(docSnap.data().Account.username);
         console.log(docSnap.data().Account.username);
      }
   };
   useEffect(() => {
      getInfoPayer();
   }, []);

   return (
      <TouchableWithAnimation
         duration={150}
         pressAnimation={0.97}
         style={[styles.cardContainer, style]}
         onPress={onPress}
      >
         <View style={{ flexDirection: "row" }}>
            <View style={{ width: 240, marginLeft: 22 }}>
               <View style={{}}>
                  <View style={{ flexDirection: "row" }}>
                     <Text style={{ fontSize: 12, fontWeight: "500" }}>
                        You owe{" "}
                     </Text>
                     <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                        {parseFloat(pay).toFixed(2)} RON
                     </Text>
                     <Text style={{ fontSize: 12, fontWeight: "500" }}>
                        {" "}
                        to {userNamePayer}
                     </Text>
                  </View>
                  <View
                     style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 7,
                        marginLeft: 10,
                     }}
                  >
                     <RedoIcon style={{ marginRight: 10 }}></RedoIcon>
                     <Text style={{ fontWeight: "800", fontSize: 12 }}>
                        {groupName}
                     </Text>
                  </View>
               </View>
            </View>
            <View
               style={{
                  alignItems: "center",
                  flexDirection: "row",
               }}
            >
               <Image
                  source={{ uri: imagePayer }}
                  style={{
                     height: 30,
                     width: 30,
                     borderRadius: 30,
                     marginRight: 20,
                  }}
               />
               <ArrowIcon></ArrowIcon>
            </View>
         </View>
      </TouchableWithAnimation>
   );
};

const styles = StyleSheet.create({
   cardContainer: {
      width: 335,
      height: 82,
      borderRadius: 17,
      backgroundColor: "white",
      alignSelf: "center",
      justifyContent: "center",
   },
});

export default ActivityCard;
