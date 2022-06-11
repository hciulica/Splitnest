import React, { useState, useRef } from "react";
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   TouchableHighlight,
   Text,
   View,
   Animated,
   Image,
} from "react-native";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import { Chip } from "react-native-paper";

export default function ChipCustom({ name, image, add, remove }) {
   const [selected, setSelected] = useState(false);

   return (
      <Chip
         style={{ marginRight: 5 }}
         mode="outlined"
         closeIcon="close-circle"
         textStyle={{ fontWeight: "600" }}
         selected={selected}
         onPress={() => {
            setSelected(!selected);
            if (!selected) add();
            else remove();
         }}
         avatar={
            image ? (
               <Image
                  source={image ? { uri: image } : null}
                  width={19}
                  height={19}
                  fill="black"
               />
            ) : null
         }
      >
         {name}
      </Chip>
   );
}

const styles = StyleSheet.create({});
