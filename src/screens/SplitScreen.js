import React, { useState, useEffect, useRef } from "react";
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
   Alert,
   TouchableOpacity,
   TouchableWithoutFeedback,
   Image,
   Animated,
   Dimensions,
   KeyboardAvoidingView,
   SafeAreaView,
   FlatList,
   Keyboard,
   ScrollView,
} from "react-native";

import { TouchableRipple } from "react-native-paper";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import { authentication, db } from "../api/firebase/firebase-config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

import BackButton from "../components/BackButton";
import PayerCard from "../components/PayerCard";
import SplitCard from "../components/SplitCard";
import InviteCard from "../components/InviteCard";

import CheckIcon from "../../assets/icons/groupsscreen/checkIcon.svg";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DropShadow from "react-native-drop-shadow";

import CircularProgress from "react-native-circular-progress-indicator";
import CheckCircularProgres from "../../assets/icons/general/checkProgressIcon.svg";

const Tab = createMaterialTopTabNavigator();

const { width, height } = Dimensions.get("window");

const SplitScreen = ({ navigation, route, navigation: { setParams } }) => {
   const [isKeyboardVisible, setKeyboardVisible] = useState(false);
   const [membersAdjust, setMembersAdjust] = useState([]);
   const [loading, setLoading] = useState(false);
   const [renderedScreen, setRenderedScreen] = useState(0);
   const [selectedChoice, setSelectedChoice] = useState(0);
   const [price, setPrice] = useState(0.0);
   const [total, setTotal] = useState(0.0);
   const [percentage, setPercentage] = useState(0.0);
   const [membersSelected, setMembersSelected] = useState(membersAdjust.length);

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         setLoading(true);
         if (route.params?.membersAdjustSplit) {
            if (route.params?.price) {
               console.log("Price:", route.params?.price);
               setPrice(route.params?.price);
            }
            let membersParams = route.params?.membersAdjustSplit;

            membersParams.forEach((member) => {
               member.pay = Number.parseFloat(
                  route.params?.price / route.params?.membersAdjustSplit.length
               ).toFixed(2);
            });
            console.log(JSON.stringify(membersParams, null, 3));

            setMembersAdjust(membersParams);
            setMembersSelected(membersParams.length);
         }
         setLoading(false);
      });

      const keyboardDidShowListener = Keyboard.addListener(
         "keyboardDidShow",
         () => {
            setKeyboardVisible(true); // or some other action
         }
      );
      const keyboardDidHideListener = Keyboard.addListener(
         "keyboardDidHide",
         () => {
            setKeyboardVisible(false); // or some other action
         }
      );

      return () => {
         unsubscribe;
         keyboardDidHideListener.remove();
         keyboardDidShowListener.remove();
      };
   }, [navigation, route.params, selectedChoice]);

   const findMemberInList = (item) => {
      const isFound = resultsMembers.some((member) => {
         if (member.email === item.email) {
            return true;
         } else return false;
      });
   };

   // const addInvited = (item) => {
   //    const friend = {
   //       username: item.username,
   //       email: item.email,
   //       image: item.image,
   //    };

   //    resultsMembers.push(friend);
   //    setResultsMembers(resultsMembers);
   // };

   // const removeInvited = (item) => {
   //    const friend = {
   //       username: item.username,
   //       email: item.email,
   //       image: item.image,
   //    };
   //    setResultsMembers(
   //       resultsMembers.filter((friend) => friend.email != item.email)
   //    );
   // };

   // const pressCheckBox = (item) => {
   //    console.log(resultsMembers);
   //    for (let i = 0; i < resultsMembers.length; i++) {
   //       if (item.email === resultsMembers[i].email) {
   //          remainingArr = resultsMembers.filter(
   //             (data) => data.email != item.email
   //          );
   //          setResultsMembers(remainingArr);
   //       } else {
   //          resultsMembers.push(item);
   //          setResultsMembers(resultsMembers);
   //       }
   //    }
   // };

   const addToSum = (value, email, name, image) => {
      for (i = 0; i < membersAdjust.length; i++) {
         if (email === membersAdjust[i].email) membersAdjust[i].pay = value;
      }
      setTotal(0.0);
      let sum = 0.0;
      for (i = 0; i < membersAdjust.length; i++)
         if (membersAdjust[i].pay !== undefined) {
            sum = sum + Number.parseFloat(membersAdjust[i].pay);
         }
      console.log(sum);

      setTotal(sum);
   };

   const addToSumPercentage = (percentage, email, name, image) => {
      // let result;
      for (i = 0; i < membersAdjust.length; i++) {
         if (email === membersAdjust[i].email)
            membersAdjust[i].pay = parseFloat(
               Number.parseFloat(percentage / 100).toFixed(4) * price
            ).toFixed(4);
      }
      setPercentage(0);
      let sum = parseFloat(0).toFixed(4);
      for (i = 0; i < membersAdjust.length; i++)
         if (membersAdjust[i].pay !== undefined) {
            console.log(membersAdjust[i]);
            sum = parseFloat(sum) + parseFloat(membersAdjust[i].pay);
         }
      const result = (parseFloat(sum) / parseFloat(price)) * 100;
      console.log(result.toFixed(2));
      setPercentage(result);
   };

   const handleChangeState = (state, email, name, image) => {
      const currentState = !state;
      let numberRemain = 0;
      const user = {
         email: email,
         name: name,
         image: image,
      };
      console.log(currentState, user);

      if (!currentState) {
         membersAdjust.forEach((element) => {
            if (element.email === email) {
               element.pay = Number.parseFloat(0).toFixed(2);
            }
         });
         membersAdjust.forEach((element) => {
            if (element.pay !== Number.parseFloat(0).toFixed(2)) {
               numberRemain = numberRemain + 1;
               console.log(numberRemain);
            }
         });

         membersAdjust.forEach((element) => {
            if (element.pay !== Number.parseFloat(0).toFixed(2)) {
               element.pay = Number.parseFloat(price / numberRemain).toFixed(2);
               console.log(price / numberRemain);
            }
         });
      } else {
         membersAdjust.forEach((element) => {
            if (element.pay !== Number.parseFloat(0).toFixed(2)) {
               numberRemain = numberRemain + 1;
               console.log(numberRemain);
            }
         });
         //For this selection
         numberRemain++;

         membersAdjust.forEach((element) => {
            if (
               element.pay !== Number.parseFloat(0).toFixed(2) ||
               element.email === email
            ) {
               element.pay = Number.parseFloat(price / numberRemain).toFixed(2);
               console.log(price / numberRemain);
            }
         });
      }

      setMembersSelected(numberRemain);
      // if(state)
   };

   const renderItem = ({ item }) => {
      return (
         <SplitCard
            style={{ marginTop: 20 }}
            name={item.username}
            email={item.email}
            image={item.image}
            radioButtonActive
            equally={selectedChoice === 0 ? true : false}
            unequally={selectedChoice === 1 ? true : false}
            percentage={selectedChoice === 2 ? true : false}
            textChange={addToSum}
            stateChange={handleChangeState}
            percentageChange={addToSumPercentage}
         ></SplitCard>
      );
   };

   const refreshMembersPay = () => {
      membersAdjust.forEach((element) => {
         element.pay = Number.parseFloat(0).toFixed(2);
      });
   };

   const handleEquallySelection = () => {
      if (selectedChoice !== 0) {
         //Auto calculate
         membersAdjust.forEach((element) => {
            element.pay = Number.parseFloat(
               price / membersAdjust.length
            ).toFixed(2);
         });
         setSelectedChoice(0);
         setMembersSelected(membersAdjust.length);
      }
   };

   const handleUnequallySelection = () => {
      if (selectedChoice !== 1) {
         refreshMembersPay();
         setSelectedChoice(1);
         setTotal(0.0);
      }
   };

   const handlePercentageSelection = () => {
      if (selectedChoice !== 2) {
         refreshMembersPay();
         setSelectedChoice(2);
         setPercentage(0.0);
      }
   };

   return (
      <KeyboardAvoidingView>
         <View>
            <View style={styles.headerContainer}>
               <BackButton
                  style={{ marginLeft: 26 }}
                  onPress={() => {
                     route.params?.callBackSplit({
                        splitType: "Equally",
                     }),
                        navigation.goBack();
                  }}
               />
               <View style={styles.textContainer}>
                  <Text style={styles.textTitleStyle}>Adjust split</Text>
               </View>
               {(parseFloat(price - total).toFixed(2) ===
                  parseFloat(0).toFixed(2) &&
                  selectedChoice === 1) ||
               (selectedChoice === 0 && membersSelected !== 0) ||
               (selectedChoice === 2 &&
                  parseFloat(percentage.toFixed(2)) == 100) ? (
                  <TouchableWithAnimation
                     onPress={() => {
                        console.log(JSON.stringify(membersAdjust, null, 3));
                        route.params?.callBackSplit({
                           splitType:
                              selectedChoice === 0
                                 ? "Equally"
                                 : selectedChoice === 1
                                 ? "Unequally"
                                 : selectedChoice === 2
                                 ? "Percentage"
                                 : null,
                        }),
                           navigation.goBack();
                     }}
                  >
                     <CheckIcon />
                  </TouchableWithAnimation>
               ) : null}
            </View>

            <View>
               <View style={styles.tabBarCustomStyle}>
                  <TouchableWithAnimation
                     onPress={() => handleEquallySelection()}
                     style={[
                        styles.intTabBar,
                        {
                           borderBottomColor:
                              selectedChoice === 0
                                 ? "#3165FF"
                                 : "rgba(49, 101, 255, 0.0)",
                        },
                     ]}
                  >
                     <Text
                        style={[
                           styles.labelTabStyle,
                           {
                              color: selectedChoice === 0 ? "black" : "#979797",
                              textAlign: "center",
                           },
                        ]}
                     >
                        Equally
                     </Text>
                  </TouchableWithAnimation>

                  <TouchableWithAnimation
                     onPress={() => handleUnequallySelection()}
                     style={[
                        styles.intTabBar,
                        {
                           borderBottomColor:
                              selectedChoice === 1
                                 ? "#3165FF"
                                 : "rgba(49, 101, 255, 0.0)",
                        },
                     ]}
                  >
                     <Text
                        style={[
                           styles.labelTabStyle,
                           {
                              color: selectedChoice === 1 ? "black" : "#979797",
                              textAlign: "center",
                           },
                        ]}
                     >
                        Unequally
                     </Text>
                  </TouchableWithAnimation>

                  <TouchableWithAnimation
                     onPress={() => handlePercentageSelection()}
                     style={[
                        styles.intTabBar,
                        {
                           borderBottomColor:
                              selectedChoice === 2
                                 ? "#3165FF"
                                 : "rgba(49, 101, 255, 0.0)",
                        },
                     ]}
                  >
                     <Text
                        style={[
                           styles.labelTabStyle,
                           {
                              color: selectedChoice === 2 ? "black" : "#979797",
                              textAlign: "center",
                           },
                        ]}
                     >
                        Percentage
                     </Text>
                  </TouchableWithAnimation>
               </View>
            </View>

            <View
               style={{
                  height: height,
                  backgroundColor: "white",
                  width: width,
               }}
            >
               <View style={{ height: height - 250, width: width }}>
                  <FlatList
                     contentContainerStyle={{
                        marginTop: 15,
                        height: isKeyboardVisible
                           ? route.params?.membersAdjustSplit.length * 140
                           : route.params?.membersAdjustSplit.length * 100,
                     }}
                     horizontal={false}
                     data={membersAdjust}
                     renderItem={renderItem}
                     keyExtractor={(item) => item.email}
                     showsVerticalScrollIndicator={false}
                     alwaysBounceVertical={false}
                  />
               </View>
            </View>

            {!loading ? (
               <View
                  style={[
                     styles.priceContainer,
                     { top: isKeyboardVisible ? -250 : 0 },
                  ]}
               >
                  <View style={{ marginLeft: 20 }}>
                     <Text style={styles.labelPrice}>Expense price</Text>
                     <Text
                        style={[
                           styles.valueStyle,
                           {
                              fontSize:
                                 price < 100
                                    ? 25
                                    : price >= 100 && price <= 999
                                    ? 22
                                    : price >= 1000 && price <= 9999
                                    ? 16
                                    : 14,
                              marginTop: 3,
                           },
                        ]}
                     >
                        {price}RON
                     </Text>
                  </View>

                  <View style={styles.separator}></View>

                  <View
                     style={{
                        alignItems: "center",
                        width: 130,
                     }}
                  >
                     {selectedChoice === 0 ? (
                        <>
                           <View
                              style={{
                                 flexDirection: "row",
                              }}
                           >
                              {membersSelected !== 0 ? (
                                 <>
                                    <Text
                                       style={{
                                          fontWeight: "800",
                                       }}
                                    >
                                       {Number.parseFloat(
                                          price / membersSelected
                                       ).toFixed(2)}
                                    </Text>

                                    <Text style={styles.bottomCardTitle}>
                                       RON/person
                                    </Text>
                                 </>
                              ) : null}
                           </View>
                           <Text style={{ fontSize: 13, fontWeight: "500" }}>
                              ({membersSelected} people)
                           </Text>
                        </>
                     ) : selectedChoice === 1 ? (
                        <>
                           <View
                              style={{
                                 alignItems: "center",
                                 flexDirection: "row",
                              }}
                           >
                              <Text
                                 style={{
                                    fontSize:
                                       parseFloat(price) - parseFloat(total)
                                          ? 10
                                          : 13,
                                    fontWeight: "500",
                                 }}
                              >
                                 Total:
                              </Text>
                              <Text
                                 style={{
                                    fontWeight: "800",
                                    color:
                                       parseFloat(price) - parseFloat(total)
                                          ? "black"
                                          : "green",
                                    fontSize:
                                       parseFloat(price) - parseFloat(total)
                                          ? 12
                                          : 15,
                                 }}
                              >
                                 {Number.parseFloat(total).toFixed(2)}
                              </Text>
                              <Text
                                 style={{
                                    fontWeight: "600",
                                    color:
                                       parseFloat(price) - parseFloat(total)
                                          ? "black"
                                          : "green",
                                    fontSize:
                                       parseFloat(price) - parseFloat(total)
                                          ? 12
                                          : 15,
                                 }}
                              >
                                 RON
                              </Text>
                           </View>
                           {parseFloat(price).toFixed(2) -
                              parseFloat(total).toFixed(2) !==
                           parseFloat(0) ? (
                              <View
                                 style={{
                                    flexDirection: "row",
                                    marginTop: 5,
                                 }}
                              >
                                 <Text
                                    style={{
                                       fontSize: 14,
                                       fontWeight: "700",
                                       color:
                                          parseFloat(price) -
                                             parseFloat(total) <
                                          parseFloat(0).toFixed(2)
                                             ? "rgba(255,97, 87, 1)"
                                             : "rgba(49,101,255,0.90)",
                                    }}
                                 >
                                    {parseFloat(price) - parseFloat(total) < 0
                                       ? parseFloat(price - total).toFixed(2)
                                       : parseFloat(price - total).toFixed(2)}
                                 </Text>
                                 <Text
                                    style={{
                                       fontWeight: "600",
                                       color:
                                          parseFloat(price) -
                                             parseFloat(total) <
                                          0
                                             ? "rgba(255,97, 87, 1)"
                                             : "rgba(49,101,255,0.90)",
                                    }}
                                 >
                                    {parseFloat(price).toFixed(2) -
                                       parseFloat(total).toFixed(2) <
                                    0
                                       ? "RON over"
                                       : "RON left"}
                                 </Text>
                              </View>
                           ) : null}
                        </>
                     ) : selectedChoice === 2 ? (
                        <>
                           <View
                              style={{
                                 justifyContent: "center",
                                 alignItems: "center",
                              }}
                           >
                              {/* <Text>{percentage.toFixed(2)}</Text> */}
                              {parseFloat(percentage.toFixed(2)) == 100 ? (
                                 <CheckCircularProgres />
                              ) : parseFloat(percentage).toFixed(2) < 100 &&
                                parseFloat(percentage).toFixed(2) >= 0 ? (
                                 <CircularProgress
                                    style={{ marginLeft: 10 }}
                                    value={parseInt(percentage).toFixed(2)}
                                    inActiveStrokeColor={"#2ecc71"}
                                    inActiveStrokeOpacity={0.15}
                                    progressValueColor={"rgba(0,0,0,0.6)"}
                                    valueSuffix={"%"}
                                    titleFontSize={6}
                                    radius={30}
                                    progressValueFontSize={12}
                                    activeStrokeWidth={10}
                                    inActiveStrokeWidth={10}
                                 />
                              ) : (
                                 <Text
                                    style={{
                                       fontWeight: "700",
                                       color: "rgba(255,97, 87, 1)",
                                    }}
                                 >
                                    {parseFloat(percentage - 100).toFixed(2)}%
                                    above
                                 </Text>
                              )}
                           </View>
                        </>
                     ) : null}
                  </View>
               </View>
            ) : (
               <View
                  style={{
                     justifyContent: "center",
                     alignItems: "center",
                     marginRight: 30,
                     marginBottom: 100,
                  }}
               >
                  <MaterialIndicator
                     size={50}
                     color="rgba(49,101,255,0.80)"
                  ></MaterialIndicator>
               </View>
            )}
         </View>
      </KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      // alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },
   headerContainer: {
      alignSelf: "flex-start",
      justifyContent: "space-between",

      flexDirection: "row",
      marginTop: 77,
      // marginLeft: 60,
      alignItems: "center",
   },
   textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 65,

      width: 135,
   },
   textTitleStyle: {
      fontSize: 17,
      fontWeight: "600",
      textAlign: "center",
   },
   textSubtitleStyle: {
      fontSize: 12,
      fontWeight: "500",
      color: "#979797",
      marginTop: 10,
   },
   priceContainer: {
      width: width - 40,
      height: 76,
      borderRadius: 20,
      position: "absolute",
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginTop: height - 120,
      backgroundColor: "white",

      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 16.0,

      elevation: 24,
   },

   labelPrice: {
      fontSize: 14,
      fontWeight: "800",
      color: "rgba(49,101,255,0.8) ",
   },

   valueStyle: {
      fontWeight: "900",
      color: "rgba(0,0,0,0.7)",
   },
   separator: {
      width: 2,
      height: 66,
      backgroundColor: "rgba(49,101,255,0.04)",
      marginLeft: 30,
      marginRight: 10,
      borderRadius: 25,
   },
   bottomCardTitle: {
      marginBottom: 7,
      fontSize: 13,
      fontWeight: "500",
   },

   labelTabStyle: {
      fontSize: 14,
      fontWeight: "700",
   },

   tabBarCustomStyle: {
      flexDirection: "row",
      marginTop: 36,
      justifyContent: "space-around",
   },

   intTabBar: {
      width: 100,
      height: 30,
      borderBottomWidth: 4,

      borderBottomRadius: 50,
      // borderBottomMarg: 9,
   },
});

export default SplitScreen;
