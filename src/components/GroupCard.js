import React, { useRef } from "react";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import {
   View,
   TouchableWithoutFeedback,
   Animated,
   Text,
   StyleSheet,
   Image,
} from "react-native";

import AvatarAdded from "../components/AvatarAdded";
import CalendarIcon from "../../assets/icons/groupsscreen/calendarIcon.svg";
import Shoppingicon from "../../assets/icons/groupsscreen/shoppingCartIcon.svg";
import CameraIcon from "../../assets/icons/groupsscreen/addCameraIcon.svg";
import CameraDefaultGroup from "../../assets/images/CameraDefaultGroup.png";

import CircularProgress from "react-native-circular-progress-indicator";

const GroupCard = ({
   name,
   createdAt,
   type,
   members,
   image,
   style,
   onPress,
}) => {
   return (
      <TouchableWithAnimation
         duration={150}
         pressAnimation={0.96}
         style={[styles.card, style]}
         onPress={onPress}
      >
         <View>
            <View
               style={{
                  flexDirection: "row",
                  marginTop: 16,
                  marginLeft: 28,
                  alignItems: "center",
               }}
            >
               {image !== "none" ? (
                  <Image
                     source={{
                        uri: image,
                     }}
                     style={styles.imageStyle}
                  />
               ) : (
                  <Image
                     source={require("../../assets/images/CameraIcon.png")}
                     style={styles.imageStyle}
                  />
               )}
               <Text style={styles.title}>{name}</Text>
            </View>
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 14,
               }}
            >
               <View
                  style={{
                     height: 10,
                     width: 10,
                     borderRadius: 25,
                     backgroundColor: "#87D297",
                     marginRight: 7,
                     marginLeft: 26,
                  }}
               ></View>
               {/* Hardcoded need create a group with auto value on 0 */}
               <Text style={{ fontWeight: "600", color: "rgba(0,0,0,0.32)" }}>
                  Total: 540 RON
               </Text>
            </View>
            {members.map((participant, index) => {
               if (index <= 2)
                  return (
                     <AvatarAdded
                        image={participant.image}
                        key={participant.email}
                        style={{
                           position: "absolute",
                           left: 24 * index,
                        }}
                        imageStyle={{
                           width: 40,
                           height: 40,
                           borderWidth: 1.5,
                           borderColor: "white",
                           marginTop: 85,
                           marginLeft: 31,
                        }}
                     ></AvatarAdded>
                  );
               if (index == 3) {
                  return (
                     <View
                        style={{
                           position: "absolute",
                           left: 24 * index,
                           height: 40,
                           width: 40,
                           marginTop: 85,
                           marginLeft: 31,
                           backgroundColor: "#FFCE93",
                           borderRadius: 50,
                           borderWidth: 1.5,
                           borderColor: "white",
                           alignItems: "center",
                           justifyContent: "center",
                        }}
                     >
                        <Text
                           style={{
                              color: "white",
                              fontWeight: "bold",
                           }}
                        >
                           +{members.length - 3}
                        </Text>
                     </View>
                  );
               }
            })}
            <View
               style={{
                  position: "absolute",
                  marginTop: 40,
                  marginLeft: 230,
               }}
            >
               <CircularProgress
                  style={{ marginLeft: 10 }}
                  value={76}
                  inActiveStrokeColor={"#2ecc71"}
                  inActiveStrokeOpacity={0.15}
                  progressValueColor={"rgba(0,0,0,0.6)"}
                  valueSuffix={"%"}
                  size={100}
                  titleFontSize={9}
                  radius={40}
                  progressValueFontSize={16}
                  activeStrokeWidth={10}
                  inActiveStrokeWidth={10}
               />
            </View>
         </View>

         <View
            style={{
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "space-between",
               marginTop: 70,
               // marginLeft: 27,
            }}
         >
            <View
               style={{
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 27,
               }}
            >
               <CalendarIcon></CalendarIcon>
               <Text style={styles.textSmall}>
                  {createdAt.month} {createdAt.day}, {createdAt.year}
               </Text>
            </View>

            <View
               style={{
                  marginLeft: 80,
                  flexDirection: "row",
                  alignItems: "center",
               }}
            >
               <Shoppingicon></Shoppingicon>
               <Text style={[styles.textSmall, { marginRight: 35 }]}>
                  6 Expenses
               </Text>
            </View>
         </View>
      </TouchableWithAnimation>
   );
};

{
   /* <CircularProgress
   value={85}
   inActiveStrokeColor={"#2ecc71"}
   inActiveStrokeOpacity={0.2}
   progressValueColor={"rgba(0,0,0,0.6)"}
   valueSuffix={"%"}
   size={100}
   titleFontSize={9}
   radius={45}
   progressValueFontSize={16}
/>; */
}

const styles = StyleSheet.create({
   card: {
      width: 347,
      height: 175,
      backgroundColor: "white",
      borderRadius: 15,
      marginTop: 20,
   },
   imageStyle: {
      height: 20,
      width: 20,
      marginRight: 10,
      borderRadius: 5,
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   textSmall: {
      color: "rgba(0,0,0,0.50)",
      marginLeft: 8,
      fontSize: 12,
      fontWeight: "300",
   },
});

export default GroupCard;
