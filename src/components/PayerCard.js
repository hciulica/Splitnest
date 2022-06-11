import React, { useState, useCallback, useEffect } from "react";
import {
   View,
   SafeAreaView,
   Text,
   Dimensions,
   StyleSheet,
   Image,
   TouchableOpacity,
} from "react-native";

import { authentication, db } from "../api/firebase/firebase-config";

const { width, height } = Dimensions.get("window");

const PayerCard = ({ name, image, email, style, handlePress, onItemClick }) => {
   const [selected, setSelected] = useState(false);

   return (
      <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
         <View style={[styles.container, style]}>
            <Image
               source={{
                  uri: image,
               }}
               style={styles.imageStyle}
            />
            <View>
               <Text
                  style={[
                     styles.nameStyle,
                     { fontWeight: name == "You" ? "800" : "600" },
                     { color: name == "You" ? "#3165FF" : "black" },
                  ]}
               >
                  {name}
               </Text>
               <Text style={styles.mailStyle}>{email}</Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   container: {
      width: width,
      flexDirection: "row",
      alignItems: "center",
   },

   imageStyle: {
      height: 50,
      width: 50,
      borderRadius: 100,
      marginLeft: 41,
   },

   nameStyle: {
      marginLeft: 23,
      fontSize: 15,
      marginBottom: 5,
      //   fontWeight: "500",
   },

   mailStyle: {
      marginLeft: 23,
      fontSize: 10,
      color: "rgba(0,0,0,0.60)",
   },
});

export default PayerCard;
