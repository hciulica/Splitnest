import React, { useState, useRef } from "react";
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   TouchableHighlight,
   Text,
   View,
   Animated,
} from "react-native";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import QrCodeIcon from "../../assets/icons/accscreen/QrCodeIcon.svg";

export default function FlatButton({
   title,
   onPress,
   disabled,
   style,
   height,
   width,
   radius,
   fontSize,
   duration,
   pressAnimation,
}) {
   const colorDisabled =
      disabled === true ? "rgba(49,101,255,0.5)" : "rgba(49,101,255,1)";
   const heightButton = height ? height : 53;
   const widthButton = width ? width : 300;
   const radiusButton = radius ? radius : 15;
   const fontSizeText = fontSize ? fontSize : 17;

   return (
      <TouchableWithAnimation
         style={[
            style,
            styles.buttonLayout,
            {
               backgroundColor: colorDisabled,
               height: heightButton,
               width: widthButton,
               borderRadius: radiusButton,
            },
         ]}
         onPress={onPress}
         disabled={disabled}
         duration={duration}
         pressAnimation={pressAnimation}
      >
         {title ? (
            <Text style={[styles.buttonText, { fontSize: fontSizeText }]}>
               {title}
            </Text>
         ) : (
            <QrCodeIcon
               style={styles.icon}
               width={20}
               height={20}
               fill="white"
            />
         )}
      </TouchableWithAnimation>
   );
}

const styles = StyleSheet.create({
   buttonLayout: {
      borderRadius: 15,
      justifyContent: "center",
   },

   buttonText: {
      color: "white",
      fontWeight: "bold",
      justifyContent: "center",
      textAlign: "center",
   },

   icon: {
      justifyContent: "center",
      alignSelf: "center",
   },
});
