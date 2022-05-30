import React, { useState, useRef } from "react";
import {
   StyleSheet,
   TouchableOpacity,
   TouchableHighlight,
   Text,
   View,
   TextInput,
} from "react-native";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

export default function FlatInput({
   value,
   onChangeText,
   style,
   placeholder,
   autoCapitalize,
   fontWeight,
   maxLength,
   type,
}) {
   return (
      <View style={[styles.containerTextInput, style]}>
         <TextInput
            style={{ fontSize: 14, marginLeft: 15, fontWeight: fontWeight }}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
            keyboardType={type === "normal" ? null : "email-address"}
            autoCorrect={false}
            maxLength={maxLength}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   containerTextInput: {
      borderRadius: 10,
      width: 237,
      height: 44,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "rgba(49,101,255,0.05)",
   },
});
