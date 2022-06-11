import React, { useState, useEffect, useRef } from "react";
import { Linking, ActivityIndicator } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { updateProfile, signOut, deleteUser } from "firebase/auth";
import { storage } from "../api/firebase/firebase-config";
import BottomSheet from "reanimated-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlatButton from "../components/FlatButton";
import CameraLogo from "../../assets/icons/accscreen/camera.svg";
import * as Progress from "react-native-progress";
import ExploreCard from "../components/ExploreCard";

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

import {
   View,
   StyleSheet,
   Button,
   Text,
   TextInput,
   Alert,
   TouchableOpacity,
   TouchableWithoutFeedback,
   Image,
   Animated,
   Dimensions,
   KeyboardAvoidingView,
   SafeAreaView,
   FlatList,
} from "react-native";

import { TouchableRipple } from "react-native-paper";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import { authentication, db } from "../api/firebase/firebase-config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import BackButton from "../components/BackButton";
import PayerCard from "../components/PayerCard";

const { width, height } = Dimensions.get("window");

const PayerScreen = ({ navigation, route, navigation: { setParams } }) => {
   const [membersSelected, setMembersSelected] = useState(null);

   useEffect(() => {
      if (route.params?.membersSelected) {
         //  console.log("Membrii selectati: ");
         //  console.log(JSON.stringify(route.params?.membersSelected, null, 3));

         setMembersSelected(route.params?.membersSelected);
         //  for (let i = 0; i < membersSelected.length; i++) {
         //     membersSelected[i].selected = false;
         //  }
      }
      // return unsubscribe;
   }, [navigation, route.params]);

   const selectPayer = (email) => {
      for (let i = 0; i < membersSelected.length; i++) {
         if (membersSelected[i].email == email)
            membersSelected[i].selected = true;
         else membersSelected[i].selected = false;
      }
      //   console.log("Membrii selectati: ");
      //   console.log(JSON.stringify(route.params?.membersSelected, null, 3));
   };

   const pressOnCard = (payer) => {
      route.params?.callBackPayer({
         payerMember: payer,
      }),
         navigation.goBack();
   };

   const renderItem = ({ item }) => {
      return (
         <PayerCard
            style={{ marginTop: 25 }}
            name={
               item.email == authentication.currentUser.email
                  ? "You"
                  : item.username
            }
            image={item.image}
            email={item.email}
            handlePress={() => pressOnCard(item)}
         ></PayerCard>
      );
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.headerContainer}>
            <BackButton
               style={{ marginLeft: 26 }}
               onPress={() => navigation.goBack()}
            />
            <View style={styles.textContainer}>
               <Text style={styles.textTitleStyle}>Payer</Text>

               <Text style={styles.textSubtitleStyle}>
                  Select member that paid
               </Text>
            </View>
         </View>

         <View style={styles.bottomContainer}>
            <FlatList
               contentContainerStyle={{
                  marginTop: 20,
                  height: route.params?.membersSelected.length * 90,
               }}
               horizontal={false}
               data={membersSelected}
               renderItem={renderItem}
               keyExtractor={(item) => item.email}
               showsVerticalScrollIndicator={false}
               alwaysBounceVertical={false}
            />
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },
   headerContainer: {
      alignSelf: "flex-start",
      justifyContent: "space-between",
      flexDirection: "row",
      marginTop: 20,
      alignItems: "center",
   },
   textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 65,
   },
   textTitleStyle: {
      fontSize: 17,
      fontWeight: "bold",
   },
   textSubtitleStyle: {
      fontSize: 12,
      fontWeight: "500",
      color: "#979797",
      marginTop: 10,
   },
   bottomContainer: {
      width: width,
      height: height - 100,
      backgroundColor: "white",
      marginTop: 14,
      borderRadius: 30,
   },
});

export default PayerScreen;
