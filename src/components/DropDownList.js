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
import XIcon from "../../assets/icons/general/xIcon.svg";

const DropDownList = ({ list, display, choiceSelected, disabled }) => {
   const [dropDown, setDropDown] = useState(null);
   const [selectedGroup, setSelectedGroup] = useState({});

   const selectGroup = (item) => {
      setDropDown(false);
      setSelectedGroup(item);
      choiceSelected(item);
   };

   useEffect(() => {
      list.map((groupAdded, index) => {
         if (groupAdded.uid != selectedGroup.uid) {
            setSelectedGroup({ name: "Select group", image: null, uid: null });
            choiceSelected({ name: "Select group", image: null, uid: null });
         }
      });

      if (list.length === 0) {
         setSelectedGroup({ name: "Select group", image: null, uid: null });
         setDropDown(false);
      }
   }, [list]);

   const renderItem = ({ item, last, index }) => {
      return (
         <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
               selectGroup(item);
            }}
            style={styles.elementDropDown}
         >
            <Image
               source={item.image ? { uri: item.image } : null}
               style={{
                  height: 15,
                  width: 15,
                  borderRadius: 10,
                  marginLeft: item.image ? 15 : 0,
               }}
            />
            <Text style={{ fontSize: 13, marginLeft: 10 }}>{item.name}</Text>
         </TouchableOpacity>
      );
   };

   return (
      <View>
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
               },
            ]}
            activeOpacity={0.6}
            onPress={() => {
               if (list.length != 0) setDropDown(!dropDown);
            }}
         >
            {selectedGroup.image ? (
               <Image
                  source={
                     selectedGroup.image !== null
                        ? { uri: selectedGroup.image }
                        : null
                  }
                  style={{
                     height: 15,
                     width: 15,
                     borderRadius: 10,
                     marginLeft: 10,
                  }}
               />
            ) : null}
            <Text
               style={{
                  fontWeight: "500",
                  width: 120,
                  textAlign: "left",
                  marginLeft: selectedGroup.image ? 10 : 10,

                  //   fontSize
               }}
            >
               {selectedGroup.name ? selectedGroup.name : "None selected"}
            </Text>

            <AngleDown
               width={15}
               height={7}
               fill="black"
               style={{
                  marginLeft: selectedGroup.image ? 5 : 30,
                  transform: [{ rotate: dropDown ? "180deg" : "0deg" }],
               }}
            ></AngleDown>
         </TouchableOpacity>

         {dropDown ? (
            <View
               style={{
                  height: list.length <= 3 ? list.length * 40 : 125,
                  width: 185,
                  borderWidth: 1,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderColor: "rgba(151,151,151,0.5)",
                  position: "absolute",
                  backgroundColor: "white",
                  top: 35,
                  elevation: 0.1,
                  zIndex: 1,
               }}
            >
               <FlatList
                  data={list}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.uid}
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
                  contentContainerStyle={{}}
               />
            </View>
         ) : null}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      width: 185,
      height: 35,
      backgroundColor: "rgba(49,101,255, 0.02)",

      borderColor: "rgba(151,151,151,0.5)",
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
      borderColor: "rgba(151,151,151,0.5)",
      flexDirection: "row",
      alignItems: "center",
   },
});

export default DropDownList;
