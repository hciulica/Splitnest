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
   width,
   children,
   fontSize,
   fontColor,
   isFocused,
   onBlur,
   onFocus,
   editable,
}) {
   const sizeFont = fontSize ? fontSize : 14;
   return (
      <View style={[styles.containerTextInput, style]}>
         <TextInput
            style={{
               fontSize: sizeFont,
               color: fontColor,
               marginLeft: 15,
               width: width,
               fontWeight: fontWeight,
            }}
            value={value}
            isFocused={isFocused}
            onBlur={onBlur}
            editable={editable}
            placeholder={placeholder}
            onChangeText={onChangeText}
            autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
            keyboardType={
               type === "default"
                  ? "default"
                  : type === "number-pad"
                  ? "decimal-pad"
                  : "email-address"
            }
            autoCorrect={false}
            maxLength={maxLength}
         />
         {children}
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
