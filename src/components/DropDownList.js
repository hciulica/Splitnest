import React, { useEffect, useState } from "react";

import {
   View,
   TouchableWithoutFeedback,
   Animated,
   Text,
   StyleSheet,
   TouchableOpacity,
   FlatList,
   Image,
} from "react-native";

import AngleDown from "../../assets/icons/expensescreen/angle-down.svg";

const DropDownList = ({ list }) => {
   const [dropDown, setDropDown] = useState(false);
   const [displayIn, setDisplayIn] = useState({
      name: "None selected",
      image: null,
   });

   let borderBottom = 0;

   const renderItem = ({ item, last, index }) => {
      const isEnd = index === list.length - 1;
      return (
         <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
               setDisplayIn({ name: item.name, image: item.image });
               setDropDown(false);
            }}
            style={styles.elementDropDown}
         >
            <Image
               source={
                  item.image
                     ? { uri: item.image }
                     : require("../../assets/images/CameraIcon.png")
               }
               style={{
                  height: 15,
                  width: 15,
                  borderRadius: 10,
                  marginLeft: 15,
               }}
            />
            <Text style={{ fontSize: 13, marginLeft: 10 }}>{item.name}</Text>
         </TouchableOpacity>
      );
   };

   return (
      <>
         <TouchableOpacity
            style={[
               styles.container,
               {
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: dropDown ? 0 : 10,
                  borderBottomRightRadius: dropDown ? 0 : 10,
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: dropDown ? 0.5 : 1,
                  //   justifyContent: "space-evenly",
               },
            ]}
            activeOpacity={0.6}
            onPress={() => setDropDown(!dropDown)}
         >
            <Image
               source={
                  displayIn.image
                     ? { uri: displayIn.image }
                     : require("../../assets/images/CameraIcon.png")
               }
               style={{
                  height: 15,
                  width: 15,
                  borderRadius: 10,
                  marginLeft: 10,
               }}
            />
            <Text
               style={{
                  fontWeight: "700",
                  width: 120,
                  textAlign: "center",
                  marginLeft: 10,
                  //   fontSize
               }}
            >
               {displayIn.name}
            </Text>

            <AngleDown
               width={15}
               height={7}
               fill="black"
               style={{ marginLeft: 5 }}
            ></AngleDown>
         </TouchableOpacity>

         {dropDown ? (
            <View
               style={{
                  height: 90,
                  width: 185,
                  borderWidth: 1,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderColor: "#979797",
               }}
            >
               <FlatList
                  data={list}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.uid}
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
               />
            </View>
         ) : null}
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      width: 185,
      height: 35,
      backgroundColor: "rgba(49,101,255, 0.02)",

      borderColor: "#979797",
      flexDirection: "row",
      alignItems: "center",
      //   justifyContent: "space-evenly",
   },
   elementDropDown: {
      width: 185,
      height: 35,
      backgroundColor: "rgba(49,101,255, 0.02)",
      //   borderWidth: 0.5,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderColor: "#979797",
      flexDirection: "row",
      alignItems: "center",
   },
});

export default DropDownList;
