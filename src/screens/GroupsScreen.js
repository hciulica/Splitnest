import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import ButtonIcon from "../../assets/icons/navbar/button.svg";

const { width, height } = Dimensions.get("window");

const GroupsScreen = ({ navigation }) => {
   return (
      <SafeAreaView
         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
         <Text>GroupsScreen</Text>
         <Text>width: {(width - 348) / 2}</Text>
         <Text>width: {height}</Text>
         <Text>Button x position: {(348 - 50) / 2}</Text>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({});

export default GroupsScreen;
