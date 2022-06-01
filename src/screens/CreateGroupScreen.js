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
   TextInput,
   Alert,
   ActivityIndicator,
} from "react-native";

import ImagePicker from "react-native-image-crop-picker";

import ButtonIcon from "../../assets/icons/navbar/button.svg";
import XIcon from "../../assets/icons/general/xIcon.svg";
import AddCameraIcon from "../../assets/icons/groupsscreen/addCameraIcon.svg";
import TripIcon from "../../assets/icons/groupsscreen/tripIcon.svg";
import HomeIcon from "../../assets/icons/groupsscreen/homeIcon.svg";
import MountainIcon from "../../assets/icons/groupsscreen/mountainIcon.svg";

import TouchableWithAnimation from "../components/TouchableWithAnimation";
import AvatarAdded from "../components/AvatarAdded";
import FlatButton from "../components/FlatButton";
import FlatInput from "../components/FlatInput";

import {
   Avatar,
   Card,
   IconButton,
   Chip,
   TouchableRipple,
} from "react-native-paper";

import { authentication, db } from "../api/firebase/firebase-config";
import { storage } from "../api/firebase/firebase-config";

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

import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";

const { width, height } = Dimensions.get("window");

const CreateGroupScreen = ({ navigation, route }) => {
   const [chipSelected, setChipSelected] = useState("");
   const [membersAdded, setMembersAdded] = useState(0);
   const [groupName, setGroupName] = useState("");
   const [groupImage, setGroupImage] = useState(null);
   const [referencesParticipants, setReferencesParticipants] = useState([]);
   const [loading, setLoading] = useState(false);

   const disabledButton =
      groupName === "" ||
      groupName === null ||
      chipSelected === "" ||
      chipSelected === null ||
      route.params?.groupParticipants === undefined
         ? true
         : false;

   useEffect(() => {
      // if (route.params?.groupParticipants) {
      //    // Post updated, do something with `route.params.post`
      //    // For example, send the post to the server
      // }
   }, [route.params?.groupParticipants]);

   const createGroup = async () => {
      if (groupName.length >= 5) {
         setLoading(true);
         try {
            const groupRef = await addDoc(collection(db, "Groups"), {
               Details: {
                  name: groupName,
                  type: chipSelected,
                  createdAt: Timestamp.now(),
               },
            });
            console.log(groupRef.id);

            //Add every group member
            route.params?.groupParticipants.forEach(async (member) => {
               const refMember = doc(db, "Users", member.email);

               await updateDoc(groupRef, {
                  Members: arrayUnion(refMember),
               });

               await updateDoc(refMember, {
                  Groups: arrayUnion(groupRef),
                  "Account.numberGroups": increment(1),
               });
            });

            //Add current user connected
            const refCurrentUser = doc(
               db,
               "Users",
               authentication.currentUser.email
            );

            await updateDoc(groupRef, {
               Members: arrayUnion(refCurrentUser),
            });

            await updateDoc(refCurrentUser, {
               Groups: arrayUnion(groupRef),
               "Account.numberGroups": increment(1),
            });
            if (groupImage !== null) uploadGroupImage(groupRef.id, groupImage);
            setLoading(false);
            navigation.navigate("Groups");
         } catch (err) {
            Alert.alert(err);
         }
      } else
         Alert.alert("Error", "Group name must be at least 5 characters long");
   };

   const uploadGroupImage = async (uid, imagePath) => {
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
            }
         });
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
            setGroupImage(image.path);
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
         setGroupImage(image.path);
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

   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>
            <View style={styles.groupText}>
               <TouchableWithAnimation
                  style={{ padding: 10 }}
                  onPress={() => navigation.goBack()}
                  disabled={loading}
               >
                  <XIcon />
               </TouchableWithAnimation>
               <Text style={styles.title}>Create group</Text>
            </View>
         </View>

         {!loading ? (
            <>
               <View style={styles.groupDetailsCard}>
                  <Text style={styles.cardTitle}> Group details</Text>
                  <View style={styles.topDetailsCard}>
                     <TouchableRipple
                        onPress={() => changeGroupImage()}
                        rippleColor="rgba(0, 0, 0, .32)"
                        style={{
                           width: 60,
                           height: 60,
                           justifyContent: "center",
                           alignItems: "center",
                           backgroundColor: "white",
                           borderRadius: 10,
                           marginRight: 15,
                           shadowColor: "#000",
                           shadowOffset: {
                              width: 0,
                              height: 0,
                           },
                           shadowOpacity: 0.25,
                           shadowRadius: 6.68,

                           elevation: 11,
                        }}
                     >
                        {!groupImage ? (
                           <AddCameraIcon />
                        ) : (
                           <Image
                              style={{
                                 justifyContent: "center",
                                 alignItems: "center",
                                 height: 60,
                                 width: 60,
                                 borderRadius: 10,
                              }}
                              source={{ uri: groupImage }}
                           />
                        )}
                     </TouchableRipple>
                     <View>
                        <Text
                           style={{
                              fontSize: 13,
                              color: "rgba(0,0,0,0.35)",
                              marginBottom: 5,
                              marginLeft: 10,
                              fontWeight: "500",
                           }}
                        >
                           Group name
                        </Text>
                        <FlatInput
                           style={{ alignSelf: "flex-start", width: 210 }}
                           placeholder="Enter a group name"
                           autoCapitalize="words"
                           fontWeight="700"
                           maxLength={21}
                           value={groupName}
                           type="normal"
                           onChangeText={(text) => setGroupName(text)}
                        />
                     </View>
                  </View>

                  <View style={styles.typeContainer}>
                     <Text
                        style={{
                           marginLeft: 10,
                           fontSize: 13,
                           fontWeight: "500",
                           color: "rgba(0,0,0,0.5)",
                        }}
                     >
                        Type
                     </Text>
                     <View style={styles.chipContainer}>
                        <Chip
                           icon={TripIcon}
                           mode="outlined"
                           style={styles.chip}
                           accessibilityLabel="Labels are read."
                           selected={chipSelected !== "Trip" ? false : true}
                           textStyle={{
                              fontSize: 12,
                              fontWeight: "bold",
                           }}
                           closeIcon={XIcon}
                           onPress={() => {
                              if (chipSelected === "Trip") setChipSelected("");
                              else setChipSelected("Trip");
                           }}
                        >
                           Trip
                        </Chip>

                        <Chip
                           icon={HomeIcon}
                           mode="outlined"
                           style={styles.chip}
                           accessibilityLabel="Labels are read."
                           selected={chipSelected !== "Home" ? false : true}
                           textStyle={{ fontSize: 12, fontWeight: "bold" }}
                           onPress={() => {
                              if (chipSelected === "Home") setChipSelected("");
                              else setChipSelected("Home");
                           }}
                        >
                           Home
                        </Chip>

                        <Chip
                           icon={MountainIcon}
                           mode="outlined"
                           style={styles.chip}
                           accessibilityLabel="Labels are read."
                           selected={chipSelected !== "Cabanna" ? false : true}
                           textStyle={{ fontSize: 12, fontWeight: "bold" }}
                           onPress={() => {
                              if (chipSelected === "Cabanna")
                                 setChipSelected("");
                              else setChipSelected("Cabanna");
                           }}
                        >
                           Cabanna
                        </Chip>
                     </View>

                     <View style={styles.memberContainer}>
                        {route.params?.groupParticipants.length ? (
                           <Text
                              style={{
                                 fontSize: 13,
                                 fontWeight: "500",
                                 marginTop: 40,
                                 color: "rgba(0,0,0,0.5)",
                                 marginLeft: 15,
                              }}
                           >
                              Members ({route.params?.groupParticipants.length}{" "}
                              added)
                           </Text>
                        ) : (
                           <Text
                              style={{
                                 fontSize: 13,
                                 fontWeight: "500",
                                 marginTop: 40,
                                 color: "rgba(0,0,0,0.5)",
                                 marginLeft: 15,
                              }}
                           >
                              Members (0 added)
                           </Text>
                        )}
                        <View
                           style={{
                              marginTop: 20,
                              marginLeft: 20,
                              flexDirection: "row",
                              alignItems: "center",
                           }}
                        >
                           {route.params?.groupParticipants.map(
                              (participant, index) => {
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
                                       <View
                                          style={{
                                             position: "absolute",
                                             left: 24 * index,
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
                                          <Text
                                             style={{
                                                color: "white",
                                                fontWeight: "bold",
                                             }}
                                          >
                                             +
                                             {route.params?.groupParticipants
                                                .length - 3}
                                          </Text>
                                       </View>
                                    );
                                 }
                              }
                           )}

                           <FlatButton
                              title="Invite"
                              onPress={() =>
                                 navigation.navigate("InviteFriends")
                              }
                              height={30}
                              width={78}
                              fontSize={12}
                              style={{
                                 marginLeft:
                                    route.params?.groupParticipants.length == 1
                                       ? 60
                                       : route.params?.groupParticipants
                                            .length == 2
                                       ? 80
                                       : route.params?.groupParticipants
                                            .length == 3
                                       ? 100
                                       : route.params?.groupParticipants.length
                                       ? 130
                                       : 0,
                              }}
                              duration={150}
                              pressAnimation={0.97}
                           />
                        </View>
                     </View>
                  </View>
               </View>

               <FlatButton
                  onPress={() => createGroup()}
                  style={{ marginTop: 160 }}
                  width={260}
                  title="Create"
                  duration={150}
                  pressAnimation={0.97}
                  disabled={disabledButton}
               />
            </>
         ) : (
            <ActivityIndicator
               style={{
                  width: width - 44,
                  height: 600,
                  alignSelf: "center",
               }}
               size="large"
               color="#3165FF"
            />
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      width: width,
      height: height,
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },
   title: {
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 20,
   },
   headerContainer: {
      width: width,
      height: 127,
      backgroundColor: "white",
      flexDirection: "row",
   },
   groupText: {
      alignItems: "center",
      flexDirection: "row",
      marginLeft: 30,
      marginTop: 40,
   },
   groupDetailsCard: {
      width: width - 44,
      height: 384,
      backgroundColor: "white",
      alignItems: "center",
      marginTop: 35,
      borderRadius: 15,
   },
   cardTitle: {
      marginTop: 30,
      marginBottom: 30,
      marginLeft: 35,
      alignSelf: "flex-start",
      fontSize: 20,
      fontWeight: "800",
      color: "#3165FF",
   },
   topDetailsCard: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
   },
   chipContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 15,
   },
   chip: {
      width: 95,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 5,
      marginRight: 5,
   },
   typeContainer: {
      marginTop: 30,
   },
});

export default CreateGroupScreen;
