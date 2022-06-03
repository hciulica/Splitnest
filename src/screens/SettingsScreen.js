import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   SafeAreaView,
   Button,
   StyleSheet,
   Dimensions,
   Alert,
   TextInput,
   TouchableWithoutFeedback,
   TouchableOpacity,
} from "react-native";

import { authentication, db } from "../api/firebase/firebase-config";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
   updatePassword,
   updateProfile,
   sendEmailVerification,
   signOut,
   deleteUser,
} from "firebase/auth";

import { doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";

// import firebase from '@react-native-firebase/app';

import FlatButton from "../components/FlatButton";
import BackButton from "../components/BackButton";

import KeyLogo from "../../assets/icons/settings/keyLogo.svg";
import DeleteLogo from "../../assets/icons/settings/deleteLogo.svg";
import AngleLogo from "../../assets/icons/settings/angleIcon.svg";
import EmailLogo from "../../assets/icons/settings/emailLogo.svg";
import CheckLogo from "../../assets/icons/settings/checkLogo.svg";
import ThickLogo from "../../assets/icons/settings/ThickLogo.svg";
import XIcon from "../../assets/icons/general/xIcon.svg";

import InputField from "../components/InputField";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import FlipCard from "react-native-flip-card";
import { onAuthStateChanged } from "firebase/auth";
import { storage } from "../api/firebase/firebase-config";

import {
   getStorage,
   uploadBytes,
   deleteObject,
   ref,
   getDownloadURL,
} from "firebase/storage";

const { width, height } = Dimensions.get("window");
const user = authentication.currentUser;

const SettingsScreen = ({ navigation }) => {
   const [verified, setVerified] = useState(
      authentication.currentUser.emailVerified
   );
   const [accountCardState, setAccountCardState] = useState(0);
   const [currentPassword, setCurrentPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [disabledChangePassword, setDisabledChangePassword] = useState(false);
   const [rightIcon, setRightIcon] = useState("eye-off");
   const [showPassword, setShowPassword] = useState(true);
   const passwordDisabled =
      newPassword === null || newPassword === "" ? true : false;

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         setVerified(authentication.currentUser.emailVerified);
      });
      return unsubscribe;
   }, [navigation]);

   onAuthStateChanged(authentication, (user) => {
      if (user) {
         setVerified(authentication.currentUser.emailVerified);
      } else {
      }
   });

   const handlePasswordVisibility = () => {
      if (rightIcon === "eye") {
         setRightIcon("eye-off");
         setShowPassword(!showPassword);
      } else if (rightIcon === "eye-off") {
         setRightIcon("eye");
         setShowPassword(!showPassword);
      }
   };

   const signOutUser = () => {
      const user = authentication.currentUser;

      if (user) {
         const email = authentication.currentUser.email;
         signOut(authentication)
            .then(() => {
               AsyncStorage.removeItem("emailLoggedIn");
               AsyncStorage.removeItem("passwordLoggedIn");

               navigation.navigate("Login");
            })
            .catch((re) => {
               Alert.alert("Error", re.message);
            });
      } else {
         Alert.alert("You are not signed in");
      }
   };

   const onChangePasswordPress = async () => {
      // await reauthenticateUser(currentPassword).then(() => {
      //     const user = authentication.currentUser;

      const user = authentication.currentUser;
      await updatePassword(user, newPassword)
         .then(() => {
            AsyncStorage.removeItem("emailLoggedIn");
            AsyncStorage.removeItem("passwordLoggedIn");
            Alert.alert("Password changed", "You need to login again", [
               {
                  text: "Logout",
                  onPress: () => signOutUser(),
                  style: "destructive",
               },
            ]);
            setAccountCardState(0);
         })
         .catch((error) => {
            switch (error.code) {
               case "auth/weak-password":
                  Alert.alert(
                     "Error",
                     "Password should be at least 6 characters"
                  );
                  break;

               case "auth/requires-recent-login":
                  Alert.alert(
                     "Reauthentication required",
                     "You need to reauthenticate if you want change password",
                     [
                        {
                           text: "Later",
                           onPress: () => setAccountCardState(0),
                           style: "cancel",
                        },

                        {
                           text: "Logout",
                           onPress: () => signOutUser(),
                           style: "destructive",
                        },
                     ]
                  );
                  break;

               default:
                  Alert.alert(error.message);
                  break;
            }
         });
   };

   const reauthenticateUser = async (currentPassword) => {
      const user = authentication.currentUser;
      const credentials = await authentication.EmailAuthProvider.credential(
         user.email,
         currentPassword
      );
      // return
      reauthenticateWithCredential(user, credentials);
   };

   const resetPassword = () => {
      console.log(authentication.currentUser);

      if (verified) {
         Alert.prompt(
            "Password reset",
            "Set a new password for your account",
            [
               {
                  text: "Reset",
                  onPress: (newPassword) =>
                     updatePassword(authentication.currentUser, newPassword)
                        .then(() => {
                           Alert.alert(
                              "Password updated",
                              "You need to authenticate again"
                           );
                        })
                        .catch((error) => {
                           Alert.alert("Error", error.message);

                           const errorCode = error.code;
                           Alert.alert(errorCode);
                        }),
                  style: "default",
               },
               {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
               },
            ],
            "secure-text"
         );
      } else Alert.alert("Please verify account first");
   };

   const verificationEmail = () => {
      sendEmailVerification(authentication.currentUser)
         .then(() => {
            Alert.alert(
               "An email verification has been sent",
               "If you confirmed already please log in again"
            );
         })
         .catch((re) => {
            const errorCode = re.code;
            if (errorCode === "auth/too-many-requests")
               Alert.alert(
                  "Please try again later",
                  "You sent to many requests"
               );
         });
   };

   const handleDeleteAccount = () => {
      if (verified) {
         Alert.alert(
            "Delete account permanently",
            "Are you sure you want to delete account",
            [
               {
                  text: "Cancel",
                  style: "cancel",
               },

               {
                  text: "Delete",
                  onPress: () => deleteAccount(),
                  style: "destructive",
               },
            ]
         );
      } else
         Alert.alert(
            "Confirm email first",
            "Please send a confirmation email to enable account settings"
         );
   };

   const deleteAccount = () => {
      const user = authentication.currentUser;
      const folderName = `Users/${authentication.currentUser.email}`;
      const storageRef = ref(
         storage,
         `${folderName}/Profile/Profile_image.png`
      );

      deleteDoc(doc(db, "Users", user.email))
         .then(() => {
            // Delete the file
            deleteObject(storageRef)
               .then(() => {
                  deleteUser(user)
                     .then(() => {
                        Alert.alert("User has been removed");
                        AsyncStorage.removeItem("emailLoggedIn");
                        AsyncStorage.removeItem("passwordLoggedIn");
                        navigation.replace("Login");
                     })
                     .catch((error) => {
                        Alert.alert(error);
                     });
               })
               .catch((error) => {
                  Alert.alert(error.message);
               });
         })
         .catch((error) => {
            Alert.alert(error.message);
         });
   };

   const resetHandle = () => {
      if (verified) setAccountCardState(1);
      else
         Alert.alert(
            "Confirm email first",
            "Please send a confirmation email to enable account settings"
         );
   };

   const backHandle = () => {
      setAccountCardState(0);
      navigation.goBack();
   };

   return (
      <SafeAreaView style={styles.container}>
         <View
            style={{
               alignSelf: "flex-start",
               alignItems: "center",
               flexDirection: "row",
               marginTop: 20,
            }}
         >
            <BackButton
               style={{ marginLeft: 26 }}
               onPress={() => backHandle()}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 19 }}>
               Settings
            </Text>
         </View>
         {/* AccountCard */}

         <FlipCard
            friction={20}
            perspective={9000}
            flipHorizontal={true}
            flipVertical={false}
            flip={
               accountCardState === 1 || accountCardState === 2 ? true : false
            }
            clickable={false}
            onFlipEnd={(isFlipEnd) => setNewPassword("")}
         >
            {/* Face Side */}
            <View style={styles.accountContainer}>
               <Text
                  style={{
                     fontWeight: "500",
                     marginLeft: 26,
                     alignSelf: "flex-start",
                  }}
               >
                  ACCOUNT
               </Text>

               <TouchableWithAnimation
                  onPress={() => resetHandle()}
                  duration={150}
                  pressAnimation={0.97}
                  style={{
                     flexDirection: "row",
                     justifyContent: "center",
                     alignItems: "center",
                     marginTop: 35,
                  }}
               >
                  <KeyLogo />
                  <View style={{ marginLeft: 20, marginRight: 30 }}>
                     <Text
                        style={{
                           fontWeight: "700",
                           fontSize: 12,
                           marginBottom: 4,
                        }}
                     >
                        Change password
                     </Text>
                     <Text
                        style={{
                           fontWeight: "bold",
                           fontSize: 10,
                           color: "rgba(151,151,151,0.9)",
                        }}
                     >
                        Change password, reset password
                     </Text>
                  </View>
                  <AngleLogo></AngleLogo>
               </TouchableWithAnimation>

               <TouchableWithAnimation
                  onPress={() => handleDeleteAccount()}
                  duration={150}
                  pressAnimation={0.97}
                  style={{
                     flexDirection: "row",
                     justifyContent: "center",
                     alignItems: "center",
                     marginTop: 35,
                  }}
               >
                  <DeleteLogo />
                  <View style={{ marginLeft: 20, marginRight: 30 }}>
                     <Text
                        style={{
                           fontWeight: "700",
                           color: "#FF0000",
                           fontSize: 12,
                           marginBottom: 4,
                        }}
                     >
                        Delete account
                     </Text>
                     <Text
                        style={{
                           fontWeight: "bold",
                           fontSize: 10,
                           color: "rgba(151,151,151,0.9)",
                        }}
                     >
                        Remove your account permanently
                     </Text>
                  </View>
                  <AngleLogo></AngleLogo>
               </TouchableWithAnimation>
            </View>

            {/* Back Side */}

            <View style={styles.resetPassContainer}>
               <TouchableWithAnimation
                  duration={50}
                  pressAnimation={0.9}
                  style={{
                     alignSelf: "flex-end",
                     marginRight: 30,
                     marginTop: 10,
                     marginBottom: 20,
                     width: 20,
                     height: 20,
                  }}
                  onPress={() => setAccountCardState(0)}
               >
                  <XIcon></XIcon>
               </TouchableWithAnimation>
               <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <Text
                     style={{
                        alignSelf: "flex-start",
                        marginBottom: 10,
                        marginLeft: 5,
                        fontSize: 13,
                     }}
                  >
                     New password
                  </Text>
                  <View
                     style={{
                        backgroundColor: "rgba(49,101,255,0.1)",
                        borderRadius: 10,
                        width: 211,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                     }}
                  >
                     <TextInput
                        name="newPassword"
                        style={{ width: 160 }}
                        value={newPassword}
                        fontSize={13}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="New password"
                        onChangeText={(text) => setNewPassword(text)}
                        secureTextEntry={showPassword}
                     />
                     <TouchableOpacity
                        onPress={handlePasswordVisibility}
                        style={styles.iconFocusShow}
                     >
                        <Feather name={rightIcon} size={15} />
                     </TouchableOpacity>
                  </View>
               </View>
               <View
                  style={{
                     flexDirection: "row",
                     marginTop: 30,
                     marginBottom: 20,
                  }}
               >
                  {/* <FlatButton title="Back" onPress = { () => setAccountCardState(0) } height={30} width={70} fontSize = {10} ></FlatButton> */}
                  <FlatButton
                     disabled={passwordDisabled}
                     onPress={() => onChangePasswordPress()}
                     title="Reset"
                     radius={15}
                     height={40}
                     width={211}
                     fontSize={12}
                  ></FlatButton>
               </View>
            </View>
         </FlipCard>

         <View style={styles.securityContainer}>
            <Text style={{ fontWeight: "500", marginTop: 33, marginLeft: 26 }}>
               SECURITY
            </Text>

            <View
               duration={150}
               pressAnimation={0.97}
               style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 35,
               }}
            >
               {!verified ? <EmailLogo /> : <ThickLogo />}
               <View style={{ marginLeft: 20, marginRight: 30 }}>
                  <Text
                     style={{
                        fontWeight: "700",
                        fontSize: 12,
                        marginBottom: 4,
                     }}
                  >
                     Confirm email
                  </Text>
                  <Text
                     style={{
                        fontWeight: "bold",
                        fontSize: 10,
                        color: "rgba(151,151,151,0.9)",
                     }}
                  >
                     Send a confirmation email{" "}
                  </Text>
                  <Text
                     style={{
                        fontWeight: "bold",
                        fontSize: 10,
                        color: "rgba(151,151,151,0.9)",
                     }}
                  >
                     to enable account settings
                  </Text>
               </View>
               <FlatButton
                  title="Send"
                  onPress={() => verificationEmail()}
                  disabled={verified}
                  height={30}
                  width={50}
                  fontSize={10}
               ></FlatButton>
            </View>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
      width: width,
      height: height,
   },

   accountContainer: {
      marginTop: 43,
      borderRadius: 20,
      width: width - 50,
      height: 241,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
   },

   resetPassContainer: {
      marginTop: 43,
      borderRadius: 20,
      width: width - 50,
      height: 241,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
   },

   securityContainer: {
      marginBottom: 220,
      borderRadius: 20,
      width: width - 50,
      height: 180,
      backgroundColor: "white",
   },
});

export default SettingsScreen;
