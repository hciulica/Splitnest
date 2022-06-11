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

const consoleAuthentication = () => {
   console.log(JSON.stringify(authentication.currentUser, null, 3));
};

const HomeScreen = () => {
   return (
      <SafeAreaView
         style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
      >
         <Text>HomeScreen</Text>
      </SafeAreaView>
   );
};

export default HomeScreen;
