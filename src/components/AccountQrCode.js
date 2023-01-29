import React, { useState, useEffect, useRef, useCallback } from "react";

import { View, StyleSheet } from "react-native";

import SplitnestIcon from "../../assets/images/SplitLogo.png";
import QRCode from "react-native-qrcode-svg";

import { authentication } from "../api/firebase/firebase-config";

const AccountQrCode = ({
   navigation,
   route,
   style,
   size,
   logoSize,
   backgroundColor,
   color,
}) => {
   const user = authentication.currentUser;

   return (
      <View style={style}>
         <QRCode
            value={"splitnestreactnativeapp/" + user.uid}
            size={size}
            borderRadius={20}
            logo={SplitnestIcon}
            logoSize={logoSize}
            logoBackgroundColor="white"
            logoBorderRadius={30}
            logoMargin={5}
            quietZone={20}
            backgroundColor={backgroundColor}
            color={color}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {},
});

export default AccountQrCode;
