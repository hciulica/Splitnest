import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import {
   View,
   Text,
   StyleSheet,
   Dimensions,
   Image,
   TouchableOpacity,
   Alert,
   TextInput,
   FlatList,
   Modal,
} from "react-native";

import FlatButton from "../components/FlatButton";
import BackButton from "../components/BackButton";
import FlipCard from "react-native-flip-card";
import CircularProgress from "react-native-circular-progress-indicator";
import AvatarAdded from "../components/AvatarAdded";
import TouchableWithAnimation from "../components/TouchableWithAnimation";

import ThreeDotsIcon from "../../assets/icons/friendsscreen/threeDotsIcon.svg";
import TripIcon from "../../assets/icons/groupsscreen/tripIcon.svg";
import HomeIcon from "../../assets/icons/groupsscreen/homeIcon.svg";
import MountainIcon from "../../assets/icons/groupsscreen/mountainIcon.svg";

import Feather from "react-native-vector-icons/Feather";

import CameraIcon from "../../assets/images/CameraIcon.png";
import PlusIcon from "../../assets/icons/general/plus.svg";
import PencilEditIcon from "../../assets/icons/general/pencilEdit.svg";

import ImagePicker from "react-native-image-crop-picker";

import InviteCard from "../components/InviteCard";

import { authentication, db } from "../api/firebase/firebase-config";
import { storage } from "../api/firebase/firebase-config";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { Linking, ActivityIndicator } from "react-native";

import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";

import * as Progress from "react-native-progress";

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
   doc,
   onSnapshot,
   setDoc,
   addDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   arrayUnion,
   serverTimestamp,
   Timestamp,
   increment,
} from "firebase/firestore";

import {
   Avatar,
   Card,
   IconButton,
   Chip,
   TouchableRipple,
} from "react-native-paper";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const { width, height } = Dimensions.get("window");
const Tab = createMaterialTopTabNavigator();

const GroupIndividualScreen = ({ navigation, route }) => {
   const [loadingMembers, setLoadingMembers] = useState(true);
   var group;

   if (route.params?.group) {
      group = route.params?.group;
   }
   const setGroupMembers = () => {
      setLoadingMembers(true);
      groupInvited = route.params?.groupInvited;

      if (groupInvited) {
         //Add for every group member
         const groupRef = doc(db, "Groups", group.uid);
         groupInvited.forEach(async (member) => {
            const refMember = doc(db, "Users", member.email);

            await updateDoc(groupRef, {
               Members: arrayUnion(refMember),
            });

            await updateDoc(refMember, {
               Groups: arrayUnion(groupRef),
               "Account.numberGroups": increment(1),
            });
            group.members.push(member);
            // console.log(member);

            console.log(JSON.stringify(group, null, 3));
         });
         //Update current group members
         //  group.members.push()
      }
      setLoadingMembers(false);
   };

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         //  console.log("Ceva");
         navigation.navigate("Expenses");
      });
      setGroupMembers();
      return unsubscribe;
   }, [route.params?.group, route.params?.groupInvited, navigation]);

   const [groupName, setGroupName] = useState(group.name);
   const [groupImage, setGroupImage] = useState(group.image);
   const [editable, setEditable] = useState(false);
   const [loading, setLoading] = useState(false);

   const Expenses = ({ navigation, params }) => {
      return (
         <View
            style={{
               justifyContent: "center",
               alignItems: "center",
               flex: 1,
            }}
         >
            {/* <Text>Groups all screen</Text> */}
            <Text>Swim</Text>
         </View>
      );
   };

   const Pay = ({ navigation, params }) => {
      return (
         <View
            style={{
               justifyContent: "center",
               alignItems: "center",
               flex: 1,
            }}
         >
            {/* <Text>Groups all screen</Text> */}
            <Text>Pay</Text>
         </View>
      );
   };

   const Members = ({ navigation }) => {
      if (!loadingMembers) {
         return (
            <View
               style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 12,
                  borderRadius: 15,
                  width: width,
                  height: 500,
                  backgroundColor: "white",
               }}
            >
               <FlatList
                  contentContainerStyle={{
                     marginTop: 15,
                     height: 85 * group.members.length,
                  }}
                  horizontal={false}
                  data={group.members}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.email}
                  showsVerticalScrollIndicator={false}
                  //  alwaysBounceVertical={false}
               />
            </View>
         );
      } else {
         return (
            <MaterialIndicator
               size={40}
               color="rgba(49,101,255,0.80)"
               style={{ marginBottom: 230 }}
            ></MaterialIndicator>
         );
      }
   };

   const renderItem = ({ item }) => {
      return (
         <InviteCard
            style={{ marginTop: 15 }}
            image={item.image}
            username={item.username}
            mail={item.email}
            added={item.added}
            you={authentication.currentUser.email == item.email ? true : false}
            add={() => addInvited(item)}
            remove={() => removeInvited(item)}
         />
      );
   };

   const uploadGroupImage = async (uid, imagePath) => {
      setLoading(true);
      const folderName = `Groups/${uid}`;
      const storageRef = ref(storage, `${folderName}/Details/Group_image.png`);
      const img = await fetch(imagePath);
      const bytes = await img.blob();
      await uploadBytes(storageRef, bytes);

      await getDownloadURL(storageRef)
         .then(async (photoURL) => {
            try {
               const refImage = doc(db, "Groups", uid);

               await updateDoc(refImage, {
                  "Details.image": photoURL,
               });
               setGroupImage(photoURL);
            } catch (err) {
               console.log(err);
            }
         })
         .catch((error) => {
            switch (error.code) {
               case "storage/object-not-found":
                  Alert.alert("Object not found");
                  break;
               case "storage/unauthorized":
                  Alert.alert("Unauthorized");
                  break;
               case "storage/canceled":
                  Alert.alert("Canceled");
                  break;

               case "storage/unknown":
                  Alert.alert("Unknown");
                  break;

               default:
                  Alert.alert(error.code);
                  break;
            }
         });

      setLoading(false);
   };

   const selectFromGalleryWithCrop = async () => {
      await ImagePicker.openPicker({
         width: 500,
         height: 500,
         cropping: true,
         mediaType: "photo",
         path: "images",
         cropperCircleOverlay: "true",
         includeBase64: true,
      })
         .then(async (image) => {
            uploadGroupImage(group.uid, image.path);
         })
         .catch((err) => {
            console.log("User canceled selection");
         });
   };

   const openCameraWithCrop = async () => {
      await ImagePicker.openCamera({
         width: 300,
         height: 400,
         cropping: true,
         mediaType: "photo",
         cropperCircleOverlay: "true",
         path: "images",
         includeBase64: true,
      }).then(async (image) => {
         uploadGroupImage(group.uid, image.path);
      });
   };

   const changeGroupImage = () => {
      Alert.alert("Choose", "Where would you rather put the group image", [
         {
            text: "From gallery",
            onPress: () => selectFromGalleryWithCrop(),
            style: "default",
         },
         {
            text: "Take a photo",
            onPress: () => openCameraWithCrop(),
            style: "default",
         },
         {
            text: "Cancel",
            style: "cancel",
         },
      ]);
   };

   const changeGroupName = async (newName) => {
      try {
         const refAccount = doc(db, "Groups", group.uid);
         await updateDoc(refAccount, {
            "Details.name": newName,
         });
         group.name = newName;
      } catch (err) {
         console.log(err);
      }
   };

   const editGroupName = async (name) => {
      if (editable) {
         if (groupName === group.name) {
            setEditable(false);
         } else editGroup(name);
      } else setEditable(true);
   };

   const editGroup = (name) => {
      if (editable) {
         if (name.length >= 5)
            Alert.alert(
               "Edit group",
               "Are you sure you want to change the group name to " + name,
               [
                  {
                     text: "Cancel",
                     onPress: () => {
                        setEditable(false);
                        setGroupName(group.name);
                     },
                     style: "cancel",
                  },

                  {
                     text: "Confirm",
                     onPress: () => {
                        changeGroupName(groupName);
                        setEditable(false);
                     },
                  },
               ]
            );
         else
            Alert.alert(
               "Error",
               "Group name must be at least 5 characters long"
            );
      }
   };

   function MyTabBar({ state, navigation }) {
      const isFocused = state.index;

      return (
         <View
            style={{
               height: 37,
               width: 300,
               alignSelf: "center",
               backgroundColor: "blue",
               borderRadius: 15,
               marginTop: 15,
               alignItems: "center",
               justifyContent: "space-between",
               backgroundColor: "white",
               flexDirection: "row",
            }}
         >
            <TouchableWithAnimation
               style={{
                  backgroundColor: isFocused === 0 ? "#3165FF" : "white",
                  width: 87.3,
                  height: 37,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
               }}
               onPress={() => {
                  // Navigate using the `navigation` prop that you received
                  navigation.navigate("Expenses");
               }}
            >
               <Text
                  style={{
                     color: isFocused === 0 ? "white" : "#3165FF",
                     fontSize: 12,
                     fontWeight: isFocused === 0 ? "700" : "600",
                  }}
               >
                  Expenses
               </Text>
            </TouchableWithAnimation>

            <TouchableWithAnimation
               style={{
                  backgroundColor: isFocused === 1 ? "#3165FF" : "white",
                  width: 87.3,
                  height: 37,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
               }}
               onPress={() => {
                  // Navigate using the `navigation` prop that you received
                  navigation.navigate("Pay");
               }}
            >
               <Text
                  style={{
                     color: isFocused === 1 ? "white" : "#3165FF",
                     fontSize: 12,
                     fontWeight: isFocused === 1 ? "700" : "600",
                  }}
               >
                  Pay
               </Text>
            </TouchableWithAnimation>

            <TouchableWithAnimation
               style={{
                  backgroundColor: isFocused === 2 ? "#3165FF" : "white",
                  width: 87.3,
                  height: 37,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
               }}
               onPress={() => {
                  // Navigate using the `navigation` prop that you received
                  navigation.navigate("Members");
               }}
            >
               <Text
                  style={{
                     color: isFocused === 2 ? "white" : "#3165FF",
                     fontSize: 12,
                     fontWeight: isFocused === 2 ? "700" : "600",
                  }}
               >
                  Members
               </Text>
            </TouchableWithAnimation>
         </View>
      );
   }

   //    const sheetRef = React.createRef();
   //    const fall = new Animated.Value(1);

   return (
      <>
         <View style={styles.container}>
            <View style={styles.topContainer}>
               <View style={styles.topButtons}>
                  <BackButton onPress={() => navigation.goBack()}></BackButton>
                  <ThreeDotsIcon style={{ marginLeft: 260 }}></ThreeDotsIcon>
               </View>
               <View style={styles.header}>
                  <View style={styles.titlePosition}>
                     <TouchableWithAnimation
                        onPress={() => editGroupName(groupName)}
                     >
                        <Feather
                           name="edit"
                           size={20}
                           color={editable ? "red" : "black"}
                           style={{ marginRight: 17 }}
                        ></Feather>
                     </TouchableWithAnimation>
                     <TextInput
                        editable={editable}
                        style={styles.title}
                        autoCapitalize="none"
                        //  keyboardType="email-address"
                        fontSize={20}
                        fontWeight={editable ? "800" : "600"}
                        autoCorrect={false}
                        name="name"
                        value={groupName}
                        onChangeText={(text) => setGroupName(text)}
                        maxLength={16}
                     ></TextInput>
                  </View>

                  <TouchableOpacity
                     onPress={() => changeGroupImage()}
                     activeOpacity={0.7}
                     style={styles.imageContainer}
                  >
                     {groupImage ? (
                        <Image
                           source={{ uri: groupImage }}
                           style={styles.imageStyle}
                        />
                     ) : (
                        <Image
                           source={require("../../assets/images/CameraIcon.png")}
                        />
                     )}
                     {loading ? (
                        <View style={{ position: "absolute", bottom: 18 }}>
                           <SkypeIndicator
                              size={20}
                              color="#FFFFFF"
                              style={{ marginTop: 230 }}
                           ></SkypeIndicator>
                        </View>
                     ) : null}
                  </TouchableOpacity>
               </View>
               <View style={styles.subtitleContainer}>
                  <CircularProgress
                     value={76}
                     inActiveStrokeColor={"rgba(49,101,255,0.8)"}
                     inActiveStrokeOpacity={0.15}
                     progressValueColor={"rgba(0,0,0,0.6)"}
                     valueSuffix={"%"}
                     size={100}
                     titleFontSize={9}
                     radius={45}
                     progressValueFontSize={16}
                     activeStrokeColor={"rgba(49,101,255,0.8)"}
                     activeStrokeWidth={10}
                     inActiveStrokeWidth={10}
                  />
                  <View style={styles.membersContainer}>
                     <Text
                        style={{
                           fontSize: 12,
                           fontWeight: "800",
                           bottom: 25,
                        }}
                     >
                        Members
                     </Text>
                     {group.members.length == 2
                        ? group.members.map((participant, index) => {
                             if (index <= 2)
                                return (
                                   <>
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
                                         }}
                                      ></AvatarAdded>

                                      <TouchableWithAnimation
                                         activeOpacity={0.7}
                                         style={{
                                            position: "absolute",
                                            left: 24 * 2,
                                            height: 40,
                                            width: 40,
                                            backgroundColor: "#FFCE93",
                                            borderRadius: 50,
                                            borderWidth: 1.5,
                                            borderColor: "white",
                                            alignItems: "center",
                                            justifyContent: "center",
                                         }}
                                         onPress={() =>
                                            navigation.navigate(
                                               "InviteFriends",
                                               {
                                                  groupMembers: group.members,
                                               }
                                            )
                                         }
                                      >
                                         <PlusIcon></PlusIcon>
                                      </TouchableWithAnimation>
                                   </>
                                );
                          })
                        : group.members.length > 3
                        ? group.members.map((participant, index) => {
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
                                      }}
                                   ></AvatarAdded>
                                );
                             if (index == 3) {
                                return (
                                   <TouchableWithAnimation
                                      activeOpacity={0.7}
                                      onPress={() =>
                                         navigation.navigate("InviteFriends", {
                                            groupMembers: group.members,
                                         })
                                      }
                                      style={{
                                         position: "absolute",
                                         left: 24 * 3,
                                         height: 40,
                                         width: 40,
                                         backgroundColor: "#FFCE93",
                                         borderRadius: 50,
                                         borderWidth: 1.5,
                                         borderColor: "white",
                                         alignItems: "center",
                                         justifyContent: "center",
                                      }}
                                   >
                                      <PlusIcon></PlusIcon>
                                   </TouchableWithAnimation>
                                );
                             }
                          })
                        : group.members.length == 3
                        ? group.members.map((participant, index) => {
                             if (index <= 2)
                                return (
                                   <>
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
                                         }}
                                      ></AvatarAdded>

                                      <TouchableWithAnimation
                                         activeOpacity={0.7}
                                         onPress={() =>
                                            navigation.navigate(
                                               "InviteFriends",
                                               {
                                                  groupMembers: group.members,
                                               }
                                            )
                                         }
                                         style={{
                                            position: "absolute",
                                            left: 24 * 3,
                                            height: 40,
                                            width: 40,
                                            backgroundColor: "#FFCE93",
                                            borderRadius: 50,
                                            borderWidth: 1.5,
                                            borderColor: "white",
                                            alignItems: "center",
                                            justifyContent: "center",
                                         }}
                                      >
                                         <PlusIcon></PlusIcon>
                                      </TouchableWithAnimation>
                                   </>
                                );
                          })
                        : null}
                  </View>
               </View>
               <View style={styles.bottomContainer}>
                  <View style={styles.typeGroupStyle}>
                     <Text
                        style={{
                           fontSize: 12,
                           fontWeight: "bold",
                           marginRight: 9,
                        }}
                     >
                        Type:
                     </Text>
                     <View
                        style={{
                           height: 30,
                           width: 93,
                           borderRadius: 25,
                           borderColor: "#979797",
                           borderWidth: 1,
                           alignItems: "center",
                           justifyContent: "center",
                           flexDirection: "row",
                        }}
                     >
                        {group.type === "Cabanna" ? (
                           <MountainIcon></MountainIcon>
                        ) : group.type === "Home" ? (
                           <HomeIcon></HomeIcon>
                        ) : group.type === "Trip" ? (
                           <TripIcon></TripIcon>
                        ) : null}
                        <Text
                           style={{
                              fontSize: 12,
                              fontWeight: "600",
                              marginLeft: 5,
                           }}
                        >
                           {group.type}
                        </Text>
                     </View>
                  </View>

                  <Text
                     style={{
                        fontSize: 12,
                        fontWeight: "bold",
                     }}
                  >
                     Spent: 530RON
                  </Text>
               </View>

               {/* <Text>{route.params?.groupInfo.name}</Text> */}
            </View>
         </View>
         <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
            <Tab.Screen name="Expenses" component={Expenses} />
            <Tab.Screen name="Pay" component={Pay} />
            <Tab.Screen name="Members" component={Members} />
         </Tab.Navigator>
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      justifyContent: "center",
   },
   topContainer: {
      width: width,
      height: 380,
      backgroundColor: "white",
      borderRadius: 40,
   },
   title: {
      fontSize: 25,
      fontWeight: "600",
      width: 170,
      textAlign: "left",
   },
   imageStyle: { height: 50, width: 50, borderRadius: 10 },

   topButtons: {
      flexDirection: "row",
      marginLeft: 30,
      marginTop: 74,

      alignItems: "center",
   },

   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
   },
   titlePosition: {
      alignItems: "center",
      marginRight: 17,
      flexDirection: "row",
   },
   imageContainer: {
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 0,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.68,

      elevation: 11,
   },
   subtitleContainer: {
      marginLeft: 42,
      marginTop: 25,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
   },
   membersContainer: {
      alignItems: "flex-end",
      marginLeft: 45,
   },

   typeGroupStyle: {
      flexDirection: "row",
      alignItems: "center",
   },

   bottomContainer: {
      marginTop: 23,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
   },
});

export default GroupIndividualScreen;
