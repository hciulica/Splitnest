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
import XIcon from "../../assets/icons/general/xIcon.svg";
import XIconAvatar from "../../assets/icons/groupsscreen/removeXAvatarIcon.svg";

import { authentication, db } from "../api/firebase/firebase-config";

export default function AvatarAdded({ image, style, imageStyle, remove }) {
   const removeAdded = () => {
      remove();
   };

   return (
      <View style={style}>
         <Image
            style={[styles.imageProfile, imageStyle]}
            source={{ uri: image }}
         />
         {/* <TouchableWithAnimation
            style={{
               position: "absolute",
               top: -7,
               left: 30,
               right: 0,
            }}
            onPress={() => removeAdded()}
         >
            <XIconAvatar></XIconAvatar>
         </TouchableWithAnimation> */}
      </View>
   );
}

const styles = StyleSheet.create({
   imageProfile: {
      height: 50,
      width: 50,
      borderRadius: 50,
   },
});
