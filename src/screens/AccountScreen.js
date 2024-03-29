import React, { useState, useEffect, useRef } from "react";
import { Linking, ActivityIndicator } from "react-native";
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
import FlipCard from "react-native-flip-card";
import AccountQrCode from "../components/AccountQrCode";

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
} from "react-native";

import { TouchableRipple } from "react-native-paper";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import { authentication, db } from "../api/firebase/firebase-config";
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AccountScreen = ({ navigation }) => {
   const animatePress = useRef(new Animated.Value(1)).current;

   const [phone, setPhone] = useState("");
   const [username, setUsername] = useState(
      authentication.currentUser.displayName
   );
   const [imageURL, setImageURL] = useState(null);
   const [friendsNumber, setFriendsNumber] = useState(null);
   const [groupsNumber, setGroupsNumber] = useState(null);

   const [isEditable, setIsEditable] = useState(false);
   const [loading, setLoading] = useState(false);
   const [colorBorderPicture, setColorBorderPicture] = useState("#3165FF");

   const [accountCardState, setAccountCardState] = useState(0);

   let colorBorderSelected = "#3165FF";
   const { width, height } = Dimensions.get("window");

   useEffect(() => {
      const fetchDataFirestore = () => {
         const docRef = doc(db, "Users", authentication.currentUser.email);
         getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
               setPhone(docSnap.data().Account.phone);
               console.log(docSnap.data().Account);
            } else console.log("No such document!");
         });
         setImageURL(authentication.currentUser.photoURL);
      };

      const unsubscribe = navigation.addListener("focus", () => {
         setIsEditable(false);
         setUsername(authentication.currentUser.displayName);
         setAccountCardState(0);
      });
      fetchDataFirestore();

      return unsubscribe;
   }, [navigation]);

   const refAccount = doc(db, "Users", authentication.currentUser.email);
   const unsub = onSnapshot(refAccount, (doc) => {
      setFriendsNumber(doc.data().Account.numberFriends);
      setGroupsNumber(doc.data().Account.numberGroups);
   });

   const editUser = async (username) => {
      try {
         const refAccount = doc(db, "Users", authentication.currentUser.email);
         await updateDoc(refAccount, {
            "Account.username": username,
         });

         await updateProfile(authentication.currentUser, {
            displayName: username,
         });
      } catch (err) {
         console.log(err);
      }
   };

   const editProfile = () => {
      if (isEditable && username.length <= 5)
         Alert.alert(
            "Error",
            "Please enter a username with at least 6 characters"
         );
      else {
         editUser(username);
         setIsEditable(!isEditable);
      }
   };

   const handleLogout = () => {
      Alert.alert("Sign out", "Are you sure you want to logout?", [
         { text: "Cancel", style: "cancel" },
         {
            text: "Logout",
            onPress: () => signOutUser(),
            style: "destructive",
         },
      ]);
   };

   const signOutUser = () => {
      const user = authentication.currentUser;

      if (user) {
         const email = authentication.currentUser.email;
         signOut(authentication)
            .then(() => {
               AsyncStorage.setItem("disabledChangePassword", "false");
               AsyncStorage.removeItem("emailLoggedIn");
               AsyncStorage.removeItem("passwordLoggedIn");
               navigation.replace("Login");
            })
            .catch((re) => {
               Alert.alert(re);
            });
      } else {
         Alert.alert("You are not signed in");
      }
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
            setLoading(true);
            setIsEditable(false);
            await uploadImageCloud(image.path);
            setLoading(false);
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
         setLoading(true);
         setIsEditable(false);
         await uploadImageCloud(image.path);
         setLoading(false);
      });
   };

   const uploadImageCloud = async (imagePath) => {
      const folderName = `Users/${authentication.currentUser.email}`;
      const storageRef = ref(
         storage,
         `${folderName}/Profile/Profile_image.png`
      );
      const img = await fetch(imagePath);
      const bytes = await img.blob();
      await uploadBytes(storageRef, bytes);

      await getDownloadURL(storageRef)
         .then(async (photoURL) => {
            await updateProfile(authentication.currentUser, {
               photoURL: photoURL,
            })
               .then(async () => {
                  try {
                     setImageURL(photoURL);
                     const refImage = doc(
                        db,
                        "Users",
                        authentication.currentUser.email
                     );
                     await updateDoc(refImage, {
                        "Account.image": photoURL,
                     });
                  } catch (err) {
                     console.log(err);
                  }
               })
               .catch((error) => {
                  Alert.alert(error);
               });
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

   const changeImageOrGallery = () => {
      Alert.alert(
         "Choose modality",
         "Choose your modality for choosing to pick image",
         [
            {
               text: "Pick image",
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
         ]
      );
   };

   return (
      <KeyboardAvoidingView style={styles.container}>
         <FlipCard
            flipHorizontal={true}
            flipVertical={false}
            flip={
               accountCardState === 1 || accountCardState === 2 ? true : false
            }
            style={{ marginBottom: 30 }}
            clickable={false}
            onFlipEnd={() => {}}
         >
            {/* Face Side */}
            <View style={[styles.topContainer, { width: width }]}>
               <Text
                  style={[
                     styles.title,
                     phone && imageURL
                        ? { marginTop: 20 }
                        : { marginBottom: 7 },
                  ]}
               >
                  Account
               </Text>

               {phone && imageURL ? (
                  <>
                     <View
                        style={{
                           justifyContent: "center",
                           alignItems: "center",
                           flexDirection: "row",
                        }}
                     >
                        <View style={styles.groupText}>
                           <Text style={styles.number}>{friendsNumber}</Text>
                           <Text
                              style={{
                                 color: "rgba(0,0,0,0.5)",
                                 fontWeight: "bold",
                              }}
                           >
                              Friends
                           </Text>
                        </View>

                        <TouchableOpacity
                           duration={100}
                           pressAnimation={0.96}
                           activeOpacity={0.75}
                           style={{ marginTop: 40 }}
                           disabled={!isEditable}
                           onPress={() => changeImageOrGallery()}
                        >
                           <Image
                              source={{ uri: imageURL }}
                              style={[styles.imageStyle, { borderTopWidth: 1 }]}
                           />

                           {isEditable ? (
                              <View
                                 style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: loading
                                       ? null
                                       : "rgba(69,69,69,0.6)",
                                    borderRadius: 75,
                                    borderWidth: 3,

                                    borderColor: "#3165FF",
                                 }}
                              >
                                 <Text
                                    style={{
                                       color: "white",
                                       fontSize: 12,
                                       fontWeight: "900",
                                    }}
                                 >
                                    Tap to change
                                 </Text>
                              </View>
                           ) : loading ? (
                              <View
                                 style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: loading
                                       ? null
                                       : "rgba(69,69,69,0.6)",
                                    borderRadius: 75,
                                 }}
                              >
                                 <Progress.CircleSnail
                                    size={150}
                                    thickness={3}
                                    indeterminate={true}
                                    direction="clockwise"
                                 />
                              </View>
                           ) : null}
                        </TouchableOpacity>

                        <View style={styles.groupText}>
                           <Text style={styles.number}>{groupsNumber}</Text>
                           <Text
                              style={{
                                 color: "rgba(0,0,0,0.5)",
                                 fontWeight: "bold",
                              }}
                           >
                              Groups
                           </Text>
                        </View>
                     </View>

                     <TextInput
                        editable={isEditable}
                        style={[
                           { fontSize: 30, marginTop: 18 },
                           { fontWeight: "600" },
                        ]}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                        name="username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        maxLength={18}
                        color={isEditable ? "#3165FF" : null}
                     ></TextInput>

                     <Text
                        style={{
                           fontSize: 12,
                           fontWeight: "700",
                           marginTop: 12,
                           color: "rgba(0,0,0,0.40)",
                        }}
                     >
                        Email: {authentication.currentUser.email}
                     </Text>
                     <Text
                        style={{
                           fontSize: 12,
                           fontWeight: "700",
                           marginTop: 5,
                           color: "rgba(0,0,0,0.40)",
                        }}
                     >
                        Phone: {phone}
                     </Text>
                     <View style={{ flexDirection: "row", marginTop: 19 }}>
                        <FlatButton
                           height={38}
                           width={136}
                           radius={10}
                           fontSize={13}
                           duration={75}
                           pressAnimation={0.97}
                           title={isEditable ? "Save" : "Edit profile"}
                           onPress={() => editProfile()}
                           disabled={!isEditable && loading}
                        ></FlatButton>
                        <FlatButton
                           height={38}
                           width={38}
                           radius={10}
                           fontSize={13}
                           duration={75}
                           pressAnimation={0.97}
                           style={{ marginLeft: 10 }}
                           onPress={() => setAccountCardState(1)}
                           disabled={!isEditable && loading}
                        ></FlatButton>
                     </View>
                  </>
               ) : (
                  <ActivityIndicator
                     style={{ width: width, height: 300 }}
                     size="large"
                     color="#3165FF"
                  />
               )}
            </View>

            {/* Back Side */}

            <View style={[styles.topContainer, { width: width }]}>
               <Text style={styles.scanQrTitle}>Scan to add</Text>
               <AccountQrCode
                  style={{ alignSelf: "center", marginTop: 20 }}
                  size={220}
                  logoSize={50}
                  backgroundColor="white"
                  color="black"
               />
               <FlatButton
                  height={38}
                  width={120}
                  radius={10}
                  fontSize={13}
                  duration={75}
                  pressAnimation={0.97}
                  style={{ marginTop: 20 }}
                  title="Done"
                  onPress={() => setAccountCardState(0)}
                  disabled={!isEditable && loading}
               ></FlatButton>
            </View>
         </FlipCard>

         <View
            style={{ alignSelf: "flex-start", marginTop: 17, marginLeft: 30 }}
         >
            <Text style={{ fontWeight: "600" }}>Explore</Text>
         </View>

         <View style={styles.exploreContainer}>
            <View style={{ alignItems: "center", flexDirection: "column" }}>
               <ExploreCard name="about" />
               <ExploreCard name="logout" onPress={() => handleLogout()} />
            </View>
            <ExploreCard
               name="settings"
               onPress={() => navigation.navigate("Settings")}
            />
            <ExploreCard
               name="payments"
               onPress={() => setAccountCardState(0)}
            />
         </View>

         <View
            style={{ alignSelf: "flex-start", marginLeft: 30, marginTop: -10 }}
         ></View>
      </KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },

   exploreContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 145,
   },

   title: {
      marginRight: 210,
      fontSize: 25,
      fontWeight: "bold",
   },
   scanQrTitle: {
      fontSize: 25,
      fontWeight: "bold",
   },
   groupText: {
      alignItems: "center",
      marginHorizontal: 35,
      marginTop: 80,
   },
   number: {
      fontSize: 20,
      fontWeight: "900",
      color: "rgba(49,101,255,0.8)",
   },

   topContainer: {
      height: 450,
      borderRadius: 30,
      paddingTop: 20,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6.68,

      elevation: 11,
   },
   imageStyle: {
      width: 130,
      height: 130,
      borderRadius: 75,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "#3165FF",
      // marginBottom: 430,
   },
});

export default AccountScreen;
