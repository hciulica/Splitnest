import React, { useState } from "react";
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Button,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default InputField = ({ name, value, onChangeText, width, height }) => {
   const [handleFocusState, setHandleFocusState] = useState(false);
   const customStyle = handleFocusState
      ? styles.fieldBoxFocus
      : styles.fieldBox;
   const customIcon = handleFocusState ? styles.iconFocus : styles.icon;
   const heightInput = height ? height : 48;
   const widthInput = width ? width : 300;

   const [showPassword, setShowPassword] = useState(true);
   const [rightIcon, setRightIcon] = useState("eye-off");

   const handlePasswordVisibility = () => {
      if (rightIcon === "eye") {
         setRightIcon("eye-off");
         setShowPassword(!showPassword);
      } else if (rightIcon === "eye-off") {
         setRightIcon("eye");
         setShowPassword(!showPassword);
      }
   };

   return (
      <>
         {name === "email" ? (
            <View>
               <Text style={styles.textPlaceHolder}>Email</Text>
               <View style={customStyle}>
                  <Feather style={customIcon} name="mail" size={19} />
                  <TextInput
                     placeholder="Enter your email address"
                     value={value}
                     style={styles.inputField}
                     onFocus={() => setHandleFocusState(true)}
                     onBlur={() => setHandleFocusState(false)}
                     autoCapitalize="none"
                     keyboardType="email-address"
                     autoCorrect={false}
                     onChangeText={(text) => onChangeText(text)}
                  ></TextInput>
               </View>
            </View>
         ) : null}

         {name === "password" ? (
            <View>
               <Text style={styles.textPlaceHolder}>Password</Text>
               <View style={customStyle}>
                  <Feather style={styles.iconPass} name="lock" size={19} />
                  <TextInput
                     placeholder="Enter your password"
                     value={value}
                     style={styles.inputField}
                     onFocus={() => setHandleFocusState(true)}
                     onBlur={() => setHandleFocusState(false)}
                     autoCapitalize="none"
                     autoCorrect={false}
                     onChangeText={(text) => onChangeText(text)}
                     secureTextEntry={showPassword}
                  ></TextInput>

                  <TouchableOpacity
                     onPress={handlePasswordVisibility}
                     style={styles.iconFocusShow}
                  >
                     <Feather name={rightIcon} size={20} />
                  </TouchableOpacity>
               </View>
            </View>
         ) : null}

         {name === "currentPassword" ? (
            <View>
               <Text style={styles.textPlaceHolder}>Current Password</Text>
               <View style={customStyle}>
                  <Feather style={styles.iconPass} name="lock" size={19} />
                  <TextInput
                     placeholder="Enter your current password"
                     value={value}
                     style={styles.inputField}
                     onFocus={() => setHandleFocusState(true)}
                     onBlur={() => setHandleFocusState(false)}
                     autoCapitalize="none"
                     autoCorrect={false}
                     onChangeText={(text) => onChangeText(text)}
                     secureTextEntry={showPassword}
                  ></TextInput>

                  <TouchableOpacity
                     onPress={handlePasswordVisibility}
                     style={styles.iconFocusShow}
                  >
                     <Feather name={rightIcon} size={20} />
                  </TouchableOpacity>
               </View>
            </View>
         ) : null}

         {name === "newPassword" ? (
            <View>
               <Text style={styles.textPlaceHolder}>New Password</Text>
               <View style={customStyle}>
                  <Feather style={styles.iconPass} name="lock" size={19} />
                  <TextInput
                     placeholder="Enter a new password"
                     value={value}
                     style={styles.inputField}
                     onFocus={() => setHandleFocusState(true)}
                     onBlur={() => setHandleFocusState(false)}
                     autoCapitalize="none"
                     autoCorrect={false}
                     onChangeText={(text) => onChangeText(text)}
                     secureTextEntry={showPassword}
                  ></TextInput>

                  <TouchableOpacity
                     onPress={handlePasswordVisibility}
                     style={styles.iconFocusShow}
                  >
                     <Feather name={rightIcon} size={20} />
                  </TouchableOpacity>
               </View>
            </View>
         ) : null}

         {name === "username" ? (
            <View>
               <Text style={styles.textPlaceHolder}>Username</Text>
               <View style={customStyle}>
                  <Feather style={styles.iconPass} name="user" size={19} />
                  <TextInput
                     placeholder="Enter your profile name"
                     value={value}
                     style={styles.inputField}
                     onFocus={() => setHandleFocusState(true)}
                     onBlur={() => setHandleFocusState(false)}
                     autoCapitalize="none"
                     keyboardType="email-address"
                     autoCorrect={false}
                     maxLength={18}
                     onChangeText={(text) => onChangeText(text)}
                  ></TextInput>
               </View>
            </View>
         ) : null}

         {name === "phone" ? (
            <View>
               <Text style={styles.textPlaceHolder}>Phone</Text>
               <View style={customStyle}>
                  <Feather style={styles.iconPass} name="phone" size={19} />
                  <TextInput
                     placeholder="Enter your phone number"
                     value={value}
                     style={styles.inputField}
                     onFocus={() => setHandleFocusState(true)}
                     onBlur={() => setHandleFocusState(false)}
                     autoCapitalize="none"
                     autoCorrect={false}
                     keyboardType="number-pad"
                     maxLength={10}
                     onChangeText={(text) => onChangeText(text)}
                  ></TextInput>
               </View>
            </View>
         ) : null}
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
   },

   icon: {
      padding: 8,
      margin: 5,
   },
   iconFocus: {
      padding: 8,
      margin: 5,
   },

   iconFocusShow: {
      padding: 5,
   },
   iconPass: {
      padding: 8,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
   },
   textPlaceHolder: {
      marginBottom: 4,
      marginLeft: 4,
      fontSize: 13,
   },
   fieldBox: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      backgroundColor: "rgba(49,101,255,0.03)",
      borderColor: "transparent",
      borderRadius: 10,
      width: 300,
      height: 48,
   },
   fieldBoxFocus: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      backgroundColor: "rgba(49,101,255,0.00)",
      backgroundOpacity: 0.2,
      borderColor: "#3165FF",
      borderRadius: 10,
      width: 300,
      height: 48,
   },

   inputField: {
      alignItems: "center",
      justifyContent: "center",
      width: 210,
      height: 48,
      fontSize: 13,
      borderRadius: 10,
   },
});
