import React, { useState, useEffect, useRef, useCallback } from "react";

import {
   SafeAreaView,
   Image,
   StyleSheet,
   FlatList,
   View,
   Text,
   StatusBar,
   TouchableOpacity,
   Dimensions,
   Animated,
   RefreshControl,
   ScrollView,
   TextInput,
   ActivityIndicator,
} from "react-native";
import SplitnestIcon from "../../assets/images/SplitLogo.png";

import QRCode from "react-native-qrcode-svg";
import { authentication } from "../api/firebase/firebase-config";
import AccountQrCode from "../components/AccountQrCode";

const AboutScreen = ({ navigation, route }) => {
   const base64Logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..";
   const user = authentication.currentUser;

   useEffect(() => {
      console.log(user);
   }, [navigation]);

   return (
      <View
         style={{
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "black",
            width: 200,
            height: 200,
         }}
      >
         <AccountQrCode
            style={{ alignSelf: "center" }}
            size={250}
            logoSize={50}
         />
      </View>
   );
};

const styles = StyleSheet.create({});

export default AboutScreen;
