import React, { useState, useEffect, useRef, useCallback } from "react";
import { Linking, ActivityIndicator, Pressable } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { updateProfile, signOut, deleteUser } from "firebase/auth";
import { storage } from "../api/firebase/firebase-config";
import BottomSheet from "reanimated-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlatButton from "../components/FlatButton";
import CameraLogo from "../../assets/icons/accscreen/camera.svg";
import * as Progress from "react-native-progress";
import ExploreCard from "../components/ExploreCard";

import CheckBoxIcon from "../../assets/icons/splitscreen/checkboxIcon.svg";
import { authentication } from "../api/firebase/firebase-config";

import {
   BallIndicator,
   BarIndicator,
   DotIndicator,
   MaterialIndicator,
   PacmanIndicator,
   PulseIndicator,
   SkypeIndicator,
   UIActivityIndicator,
   WaveIndicator,
} from "react-native-indicators";

import {
   View,
   StyleSheet,
   Button,
   Text,
   TextInput,
   Alert,
   TouchableOpacity,
   TouchableWithoutFeedback,
   Image,
   Animated,
   Dimensions,
   KeyboardAvoidingView,
   SafeAreaView,
   FlatList,
} from "react-native";

const { width, height } = Dimensions.get("window");

const SplitCard = ({
   name,
   email,
   image,
   style,
   textChange,
   percentageChange,
   stateChange,
   equally,
   unequally,
   percentage,
}) => {
   const [selected, setSelected] = useState(true);
   const [value, setValue] = useState(Number.parseFloat(0).toFixed(2));
   const [valuePercentage, setValuePercentage] = useState(
      Number.parseFloat(0).toFixed(2)
   );
   const [focused, setFocused] = useState(false);
   const [focusedPercentage, setFocusedPercentage] = useState(false);

   useEffect(() => {
      if (unequally) {
         setValue(Number.parseFloat(0).toFixed(2));
         setFocused(false);
      }
      if (equally) {
         setSelected(true);
      }
      if (percentage) {
         console.log("UMILIRE");
         setValuePercentage(parseFloat(0).toFixed(2));
         setFocusedPercentage(false);
      }
   }, [unequally, equally, percentage]);

   const changeValue = (value) => {
      textChange(value, email, name, image);
   };

   const changeValuePercentage = (value) => {
      percentageChange(value, email, name, image);
   };

   const handleChangeState = (selected, email, name, image) => {
      if (selected) setSelected(false);
      else setSelected(true);
      stateChange(selected, email, name, image);
   };

   return (
      <View>
         <View style={[styles1.container, style]}>
            <Image
               source={{
                  uri: image,
               }}
               style={styles1.imageStyle}
            />
            <View style={{ width: unequally || percentage ? 190 : 235 }}>
               <Text
                  style={[
                     styles1.nameStyle,
                     {
                        fontWeight:
                           authentication.currentUser.email == email
                              ? "800"
                              : "600",
                     },
                     {
                        color:
                           authentication.currentUser.email == email
                              ? "#3165FF"
                              : "black",
                     },
                  ]}
               >
                  {authentication.currentUser.email !== email ? name : "You"}
               </Text>
               <Text style={styles1.mailStyle}>{email}</Text>
            </View>

            {equally ? (
               <TouchableOpacity
                  onPress={() =>
                     handleChangeState(selected, email, name, image)
                  }
               >
                  {!selected ? (
                     <View style={styles1.uncheckedIconStyle}></View>
                  ) : (
                     <CheckBoxIcon
                        fill="rgba(49, 101, 255, 0.9)"
                        width={20}
                        height={20}
                     ></CheckBoxIcon>
                  )}
               </TouchableOpacity>
            ) : null}
            {unequally ? (
               <View
                  style={[
                     styles1.boxContainer,
                     {
                        borderColor: !focused
                           ? "rgba(151,151,151,0.3)"
                           : "rgba(49, 101, 255, 0.6)",
                     },
                  ]}
               >
                  <View style={{ marginRight: 13 }}>
                     <TextInput
                        style={{
                           width: 87,
                           height: 50,
                           borderRadius: 15,
                           fontWeight: "bold",
                           fontSize:
                              value >= 0 && value <= 999
                                 ? 16
                                 : value >= 1000 && value <= 9999
                                 ? 14
                                 : value >= 10000 && value <= 99999
                                 ? 12
                                 : 10,
                           textAlign: "right",
                        }}
                        value={value}
                        onChangeText={(value) => setValue(value)}
                        onBlur={() => {
                           setFocused(false);
                           const currentPrice = Number.parseFloat(value);
                           if (
                              currentPrice === 0.0 ||
                              currentPrice === "" ||
                              isNaN(currentPrice) ||
                              currentPrice <= 0.0
                           ) {
                              setValue(Number.parseFloat(0).toFixed(2));
                              changeValue(Number.parseFloat(0).toFixed(2));
                           } else {
                              setValue(Number.parseFloat(value).toFixed(2));
                              changeValue(Number.parseFloat(value).toFixed(2));
                           }
                        }}
                        onFocus={() => setFocused(true)}
                        placeholder="Price"
                        keyboardType="decimal-pad"
                     />
                  </View>
               </View>
            ) : null}

            {percentage ? (
               <View
                  style={[
                     styles1.boxContainer,
                     {
                        borderColor: !focusedPercentage
                           ? "rgba(151,151,151,0.3)"
                           : "rgba(49, 101, 255, 0.6)",
                     },
                  ]}
               >
                  <View style={{ marginRight: 8 }}>
                     <TextInput
                        style={{
                           width: 87,
                           height: 50,
                           borderRadius: 15,
                           fontWeight: "bold",
                           fontSize:
                              parseFloat(valuePercentage).toFixed(2) >= 0 &&
                              parseFloat(valuePercentage).toFixed(2) < 100
                                 ? 15
                                 : 12,
                           textAlign: "center",
                        }}
                        value={valuePercentage}
                        onChangeText={(valuePercentage) =>
                           setValuePercentage(valuePercentage)
                        }
                        onBlur={() => {
                           setFocusedPercentage(false);
                           const currentPercentage =
                              parseFloat(valuePercentage).toFixed(2);
                           if (
                              currentPercentage === parseFloat(0).toFixed(2) ||
                              currentPercentage === "" ||
                              isNaN(currentPercentage)
                           ) {
                              setValuePercentage(parseFloat(0).toFixed(2));
                              changeValuePercentage(parseFloat(0).toFixed(2));
                              // changeValue(Number.parseFloat(0).toFixed(2));
                           } else if (currentPercentage > 100) {
                              setValuePercentage(
                                 Number.parseFloat(100).toFixed(2)
                              );
                              changeValuePercentage(
                                 Number.parseFloat(100).toFixed(2)
                              );
                           } else {
                              setValuePercentage(
                                 Number.parseFloat(valuePercentage).toFixed(2)
                              );
                              changeValuePercentage(
                                 Number.parseFloat(valuePercentage).toFixed(2)
                              );
                           }
                        }}
                        onFocus={() => setFocusedPercentage(true)}
                        maxLength={100}
                        placeholder="Perc"
                        keyboardType="decimal-pad"
                     />
                     <Text
                        style={{
                           fontWeight: "bold",
                           position: "absolute",
                           left: 70,
                           top: 15,
                        }}
                     >
                        %
                     </Text>
                  </View>
               </View>
            ) : null}
         </View>
      </View>
   );
};

const styles1 = StyleSheet.create({
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
   uncheckedIconStyle: {
      height: 20,
      width: 20,
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: "rgba(49, 101, 255, 0.5)",
   },
   boxContainer: {
      width: 87,
      height: 50,
      borderRadius: 15,
      borderWidth: 1,
      // borderColor: "rgba(151,151,151,0.3)",
      alignItems: "flex-end",
      justifyContent: "center",
   },
});

export default SplitCard;
