import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   SafeAreaView,
   Button,
   ActivityIndicator,
   TouchableWithoutFeedback,
   TouchableOpacity,
   Alert,
   Image,
   StyleSheet,
   Dimensions,
} from "react-native";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   GoogleAuthProvider,
   signInWithPopup,
   getAuth,
   onAuthStateChanged,
   updateProfile,
   signInWithPhoneNumber,
   RecaptchaVerifier,
   sendEmailVerification,
} from "firebase/auth";

import {
   doc,
   onSnapshot,
   setDoc,
   addDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   arrayUnion,
   serverTimestamp,
   Timestamp,
   increment,
} from "firebase/firestore";

import { authentication, db } from "../api/firebase/firebase-config";
import BackButton from "../components/BackButton";
import CheckIcon from "../../assets/icons/groupsscreen/checkIcon.svg";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import FlatInput from "../components/FlatInput";

import ArrowIcon from "../../assets/icons/individualscreen/arrowIcon.svg";

const ConfirmPayScreen = ({ navigation, route }) => {
   const { width, height } = Dimensions.get("window");

   const [results, setResults] = useState(null);
   const [loading, setLoading] = useState(false);

   var paymentInfo;

   useEffect(() => {
      if (route.params?.paymentInfo) {
         setLoading(true);

         console.log(JSON.stringify(route.params?.paymentInfo, null, 3));
         console.log("POKER");
         //  setResults(route.params?.paymentInfo);
         setLoading(false);
         paymentInfo = route.params?.paymentInfo;
      }
   }, [route.params?.paymentInfo, route.params?.groupUid]);

   const handleConfirmPayment = async () => {
      const paymentInfo = route.params?.paymentInfo;
      const groupUid = route.params?.groupUid;

      const docRef = doc(db, "Groups", groupUid);

      const docSub = await addDoc(collection(db, docRef), {
         name: "Tokyo",
         country: "Japan",
      });

      await updateDoc(docRef, {
         Expenses2: docSub,
      });

      console.log(paymentInfo, groupUid);
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.headerContainer}>
            <BackButton
               style={{ marginLeft: 26 }}
               onPress={() => navigation.goBack()}
            />
            <View style={styles.textHeaderContainer}>
               <Text
                  style={{
                     fontSize: 17,
                     fontWeight: "bold",
                  }}
               >
                  Confirm payment
               </Text>
               <View style={{ flexDirection: "row" }}>
                  <Text
                     style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: "#979797",
                        marginTop: 10,
                     }}
                  >
                     Confirm that you paid{" "}
                  </Text>
                  <Text
                     style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: "#979797",
                        marginTop: 10,
                     }}
                  >
                     {route.params?.paymentInfo.payer.username
                        ? route.params?.paymentInfo.payer.username.substring(
                             0,
                             route.params?.paymentInfo.payer.username.indexOf(
                                " "
                             )
                          ) !== ""
                           ? route.params?.paymentInfo.payer.username.substring(
                                0,
                                route.params?.paymentInfo.payer.username.indexOf(
                                   " "
                                )
                             )
                           : route.params?.paymentInfo.payer.username.substring(
                                0,
                                8
                             )
                        : null}
                  </Text>
               </View>
            </View>

            <TouchableWithAnimation onPress={() => handleConfirmPayment()}>
               <CheckIcon />
            </TouchableWithAnimation>
         </View>

         <View
            style={[styles.bottomContainer, { height: height, width: width }]}
         >
            <View style={styles.imagesContainer}>
               <Image
                  source={{ uri: authentication.currentUser.photoURL }}
                  style={{ width: 80, height: 80, borderRadius: 100 }}
               />
               <ArrowIcon style={{ marginHorizontal: 18 }}></ArrowIcon>
               <Image
                  source={{ uri: route.params?.paymentInfo.payer.image }}
                  style={{ width: 80, height: 80, borderRadius: 100 }}
               />
            </View>

            <View style={{ flexDirection: "row", marginTop: 50 }}>
               <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  You paid{" "}
               </Text>
               <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {route.params?.paymentInfo.payer.username
                     ? route.params?.paymentInfo.payer.username.substring(
                          0,
                          route.params?.paymentInfo.payer.username.indexOf(" ")
                       ) !== ""
                        ? route.params?.paymentInfo.payer.username.substring(
                             0,
                             route.params?.paymentInfo.payer.username.indexOf(
                                " "
                             )
                          )
                        : route.params?.paymentInfo.payer.username.substring(
                             0,
                             8
                          )
                     : null}
               </Text>
            </View>
            <Text
               style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: "rgba(0,0,0,0.40)",
                  marginTop: 5,
               }}
            >
               {route.params?.paymentInfo.payer.email}
            </Text>
            <View>
               <FlatInput
                  style={{ width: 150, height: 53, marginTop: 38 }}
                  type="number-pad"
                  editable={false}
                  value={route.params?.paymentInfo.sumPay.toString()}
                  fontSize={
                     route.params?.paymentInfo.sumPay >= parseFloat(1000) &&
                     route.params?.paymentInfo.sumPay >= parseFloat(9999)
                        ? 17
                        : route.params?.paymentInfo.sumPay >=
                             parseFloat(1000) &&
                          route.params?.paymentInfo.sumPay >= parseFloat(9999)
                        ? 15
                        : 20
                  }
                  fontWeight="600"
               ></FlatInput>
               <View
                  style={{
                     height: 39,
                     width: 52,
                     borderRadius: 5,
                     backgroundColor: "white",
                     position: "absolute",
                     alignItems: "center",
                     justifyContent: "center",
                     left: 90,
                     top: 45,
                  }}
               >
                  <Text style={{ fontWeight: "800", fontSize: 11 }}>RON</Text>
               </View>
            </View>

            <Text
               style={{
                  marginTop: 90,
                  fontSize: 12,
                  fontWeight: "600",
                  color: "rgba(0, 0, 0, 0.4)",
                  width: 213,
                  textAlign: "center",
                  lineHeight: 17,
               }}
            >
               Once you have confirmed the payment to{" "}
               {route.params?.paymentInfo.payer.username}, it will be recorded
               that you have paid
            </Text>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },
   headerContainer: {
      alignSelf: "flex-start",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginTop: 20,
   },
   textHeaderContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: 270,
   },

   bottomContainer: {
      marginTop: 23,
      backgroundColor: "white",
      borderRadius: 30,
      alignItems: "center",
   },

   imagesContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 140,
   },
});

export default ConfirmPayScreen;
