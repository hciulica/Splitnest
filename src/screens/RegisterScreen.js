import React, { useState } from "react";

import {
   View,
   StyleSheet,
   Button,
   Text,
   TextInput,
   Alert,
   AlertType,
   TouchableOpacity,
   Image,
   KeyboardAvoidingView,
   KeyboardAwareScrollView,
   ActivityIndicator,
   Dimensions,
} from "react-native";

import { authentication, db } from "../api/firebase/firebase-config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../api/firebase/firebase-config";
import FlatButton from "../components/FlatButton";
import LinearGradient from "react-native-linear-gradient";
import LogoRounded from "../../assets/images/LogoRounded.svg";
import SplitLogo from "../../assets/images/SplitLogo.png";
import BasicImage from "../../assets/images/Image_profile.png";

import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   GoogleAuthProvider,
   signInWithPopup,
   getAuth,
   onAuthStateChanged,
   updateProfile,
   signInWithPhoneNumber,
   RecaptchaVerifier,
   sendEmailVerification,
} from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
   const [isSignedIn, setIsSignedIn] = useState(false);
   const [username, setUsername] = useState(null);
   const [phone, setPhone] = useState(null);
   const [email, setEmail] = useState(null);
   const [password, setPassword] = useState(null);
   const [emailLoggedIn, setEmailLoggedIn] = useState(false);
   const [loading, setLoading] = useState(false);

   const disableButton =
      email === null ||
      email === "" ||
      password === null ||
      password === "" ||
      username === null ||
      username === "" ||
      phone === null ||
      phone === ""
         ? true
         : false;
   const { width, height } = Dimensions.get("window");

   const updateImage = async () => {
      const imagePath = "https://i.imgur.com/pVbj3Y0.png";
      await updateProfile(authentication.currentUser, {
         photoURL: imagePath,
      })
         .then(() => {})
         .catch((error) => {
            Alert.alert(error);
         });
   };

   const uploadImageCloud = async () => {
      const imagePath = "https://i.imgur.com/pVbj3Y0.png";

      const folderName = `Users/${authentication.currentUser.email}`;
      const storageRef = ref(
         storage,
         `${folderName}/Profile/Profile_image.png`
      );
      const img = await fetch(imagePath);
      const bytes = await img.blob();

      addImageToFirestore(imagePath);

      await uploadBytes(storageRef, bytes);
      await updateImage();
   };

   const consoleAuthentication = () => {
      console.log(JSON.stringify(authentication.currentUser, null, 3));
   };

   const addImageToFirestore = async (imageURL) => {
      try {
         const refImage = doc(db, "Users", authentication.currentUser.email);

         await updateDoc(refImage, {
            "Account.image": imageURL,
         });
      } catch (err) {
         console.log(err);
      }
   };

   const addToFirestoreForAuthentication = async () => {
      try {
         const spentToday = {
            date: new Date(),
            spent: 0,
         };
         await setDoc(doc(db, "Users", authentication.currentUser.email), {
            Account: {
               username: username,
               phone: parseInt(phone, 10),
               numberFriends: 0,
               numberGroups: 0,
               spentToday: spentToday,
               paymentsMade: 0,
            },
         });
      } catch (err) {
         console.log(err);
      }
   };

   const handleSignUp = async () => {
      if (!username) Alert.alert("Error", "Please enter a username");
      else if (username.length <= 5)
         Alert.alert(
            "Error",
            "Please enter a username with at least 6 characters"
         );
      else if (phone.length != 10)
         Alert.alert("Error", "Please enter a valid phone number");
      else if (!phone) Alert.alert("Error", "Please enter a phone number");
      else
         createUserWithEmailAndPassword(authentication, email, password)
            .then(() => {
               setLoading(true);
               updateProfile(authentication.currentUser, {
                  displayName: username,
               })
                  .then(async () => {
                     addToFirestoreForAuthentication();
                     consoleAuthentication();
                     await uploadImageCloud();
                     navigation.navigate("Tab");
                     setLoading(false);
                  })
                  .catch((error) => {
                     setLoading(false);
                     const errorCode = re.code;
                     Alert.alert(error);
                  });
            })
            .catch((re) => {
               const errorCode = re.code;
               switch (errorCode) {
                  case "auth/email-already-in-use":
                     Alert.alert("Error", "Email is already in use");
                     break;

                  case "auth/weak-password":
                     Alert.alert(
                        "Error",
                        "Password should be at least 6 characters"
                     );
                     break;

                  case "auth/internal-error":
                     Alert.alert("Error", "Please enter a password");
                     break;

                  case "auth/invalid-email":
                     Alert.alert("Error", "Please enter a valid email");
                     break;

                  case "auth/network-request-failed":
                     Alert.alert(
                        "Network error",
                        "Please check your internet connection"
                     );
                     break;

                  default:
                     Alert.alert(errorCode);
                     break;
               }
               console.log(re);
            });
   };

   const resetPassword = () => {
      resetButt();
      sendPasswordResetEmail(authentication, email)
         .then(() => {
            Alert.alert("Password reset email success");
         })
         .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/user-not-found") {
               Alert.alert("There is not an account created with this email");
            }
            console.log(error);
            //Alert.alert(errorCode);
         });
   };

   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1, backgroundColor: "white" }}
      >
         <View style={styles.container}>
            <LogoRounded />
            <Text style={{ fontSize: 26, marginTop: 22, fontWeight: "900" }}>
               Welcome to Splitnest!
            </Text>
            <Text style={{ fontSize: 21, marginTop: 20, marginBottom: 22 }}>
               Create an account
            </Text>

            {!loading ? (
               <>
                  <View style={styles.fieldsBoxStyle}>
                     <InputField
                        name="username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                     />
                  </View>

                  <View style={styles.fieldsBoxStyle}>
                     <InputField
                        name="phone"
                        value={phone}
                        onChangeText={(text) => setPhone(text)}
                     />
                  </View>

                  <View style={styles.fieldsBoxStyle}>
                     <InputField
                        name="email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                     />
                  </View>

                  <View style={styles.fieldsBoxStyle}>
                     <InputField
                        name="password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                     />
                  </View>
                  <View style={{ marginTop: 30 }}>
                     <FlatButton
                        title="Sign up"
                        disabled={disableButton}
                        duration={150}
                        pressAnimation={0.97}
                        onPress={handleSignUp}
                     ></FlatButton>
                  </View>

                  <View style={styles.groupBottom}>
                     <Text
                        style={{
                           fontWeight: "400",
                           fontSize: 16,
                           marginRight: 10,
                           opacity: 0.35,
                        }}
                     >
                        Do you have any account?
                     </Text>
                     <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.touchableOpacityStyle}>
                           Sign in
                        </Text>
                     </TouchableOpacity>
                  </View>
               </>
            ) : (
               <>
                  <ActivityIndicator
                     style={{ width: width, height: 270 }}
                     size="large"
                     color="#3165FF"
                  />
               </>
            )}
         </View>
      </KeyboardAvoidingView>
   );
};

const styles = StyleSheet.create({
   imageContainer: {
      borderColor: "#5A429A",
      borderWidth: 3,
      paddingTop: 19,
      paddingLeft: 16,
      paddingBottom: 18,
      paddingRight: 13,
      borderRadius: 75,
   },
   logoStyle: {
      width: 74,
      height: 66,

      // resizeMode: 'stretch',
   },
   touchableOpacityStyle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#3165FF",
      justifyContent: "center",
   },
   groupBottom: {
      flexDirection: "row",
      marginTop: 24,
   },
   fieldsBoxStyle: {
      marginBottom: 16,
   },
   container: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
   },
   textField: {
      height: 60,
      margin: 12,
      borderWidth: 1,
      padding: 10,
   },
   forgotpass: {
      color: 0xa6a6a6,
   },
});

export default RegisterScreen;
