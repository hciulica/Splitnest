import React, { useEffect } from "react";
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
   Dimensions,
   StyleSheet,
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

import { authentication, db } from "../api/firebase/firebase-config";
import CalendarIcon from "../../assets/icons/homescreen/calendarIcon.svg";

const { width, height } = Dimensions.get("window");

const consoleAuthentication = () => {
   console.log(JSON.stringify(authentication.currentUser, null, 3));
};

const HomeScreen = () => {
   useEffect(() => {
      let today = new Date();
      console.log(today.getDate());

      console.log(today.getFullYear());

      console.log(today.getMonth() + 1);
   }, []);

   return (
      <View
         style={{
            // justifyContent: "center",
            // alignItems: "center",

            width: width,
            height: 388,
            backgroundColor: "white",
            borderRadius: 15,
         }}
      >
         <View
            style={{
               marginLeft: 22,
               marginTop: 67,
               flexDirection: "row",
               alignItems: "center",
            }}
         >
            <Text style={styles.dateStyle}>Jun 20, 2022</Text>
            <CalendarIcon style={{ marginLeft: 12 }}></CalendarIcon>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   dateStyle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#979797",
   },
});

export default HomeScreen;
