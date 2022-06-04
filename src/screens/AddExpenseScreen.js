import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   Dimensions,
   KeyboardAvoidingView,
   SafeAreaView,
   Keyboard,
   TouchableWithoutFeedback,
   ScrollView,
   Image,
   TouchableOpacity,
   FlatList,
} from "react-native";

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

import DropDownPicker from "react-native-dropdown-picker";
import DropDownList from "../components/DropDownList";

import FlatButton from "../components/FlatButton";
import FlipCard from "react-native-flip-card";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import FlatInput from "../components/FlatInput";

import XIcon from "../../assets/icons/general/xIcon.svg";
import ReceiptIcon from "../../assets/icons/expensescreen/receiptIcon.svg";
import MoneyIcon from "../../assets/icons/expensescreen/moneyIcon.svg";
import AngleDown from "../../assets/icons/expensescreen/angle-down.svg";

import { authentication, db } from "../api/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import ImageNew from "../../assets/images/calculator-front-color.png";

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
} from "firebase/firestore";

import { Chip } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const AddExpenseScreen = ({ navigation }) => {
   const [loading, setLoading] = useState(false);
   const [loadingDropDown, setLoadingDropDown] = useState(false);
   const [results, setResults] = useState([]);
   const [filteredResults, setFilteredResults] = useState([]);

   const [open, setOpen] = useState(false);
   const [value, setValue] = useState(null);

   const [imageURL, setImageURL] = useState(null);

   const [items, setItems] = useState([
      {
         label: "Apple",
         value: "apple",
         icon: () => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
               <Image
                  source={{ uri: imageURL }}
                  style={{
                     width: 20,
                     height: 20,
                     marginLeft: 20,
                     borderWidth: 1,
                     alignSelf: "center",
                  }}
               />
            </View>
         ),
      },
      { label: "Banana", value: "banana" },
   ]);

   useEffect(() => {
      setImageURL(authentication.currentUser.photoURL);
      console.log(JSON.stringify(authentication.currentUser.photoURL));
   }, [navigation]);

   const getGroups = async () => {
      setLoading(true);
      let groups = [];
      let group = {};

      const refFriends = doc(db, "Users", authentication.currentUser.email);
      const docFriends = await getDoc(refFriends);

      if (docFriends.exists()) {
         const refGroup = docFriends.data().Groups;
         if (refGroup)
            for (let i = 0; i < refGroup.length; i++) {
               const docGroupDetails = await getDoc(refGroup[i]);

               if (docGroupDetails.exists()) {
                  const refMembers = docGroupDetails.data().Members;
                  console.log(
                     "Pentru numele grupului ",
                     docGroupDetails.data().Details.name,
                     ":"
                  );

                  group = {
                     uid: docGroupDetails.id,
                     name: docGroupDetails.data().Details.name,
                     image: docGroupDetails.data().Details.image,
                  };
               }
               groups.push(group);
            }
      }
      setResults(groups);
      setFilteredResults(groups);
      setLoading(false);
      console.log(groups);
   };

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         getGroups();
      });

      return unsubscribe;
   }, [navigation]);

   return (
      <TouchableWithoutFeedback
         onPress={() => Keyboard.dismiss()}
         accessible={false}
      >
         <View style={styles.container}>
            <View style={styles.headerContainer}>
               <View style={styles.groupText}>
                  <TouchableWithAnimation
                     style={{ padding: 10 }}
                     onPress={() => navigation.goBack()}
                     // disabled={loading}
                  >
                     <XIcon />
                  </TouchableWithAnimation>

                  <Text style={styles.title}>Add expense</Text>
               </View>

               <View
                  style={{
                     alignItems: "center",
                     flexDirection: "row",
                  }}
               >
                  <Text
                     style={{
                        marginLeft: 30,
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#979797",
                     }}
                  >
                     Groups:
                  </Text>
                  <ScrollView horizontal>
                     <Chip
                        mode="flat"
                        closeIcon="close-circle"
                        textStyle={{ fontWeight: "600" }}
                        avatar={
                           <Image
                              source={{
                                 uri: authentication.currentUser.photoURL,
                              }}
                              width={19}
                              height={19}
                              fill="black"
                           />
                        }
                        onClose={() => navigation.goBack()}
                     >
                        Revelion 2020
                     </Chip>
                     <Chip
                        icon="information"
                        closeIcon="close-circle"
                        onClose={() => navigation.goBack()}
                     >
                        Example chip
                     </Chip>
                     <Chip
                        icon="information"
                        closeIcon="close-circle"
                        onClose={() => navigation.goBack()}
                     >
                        Example chip
                     </Chip>
                     <Chip
                        icon="information"
                        closeIcon="close-circle"
                        onClose={() => navigation.goBack()}
                     >
                        Example chip
                     </Chip>
                  </ScrollView>
               </View>
            </View>
            {!loading ? (
               <>
                  <View style={styles.detailsContainer}>
                     <Text style={styles.titleText}>Expense details</Text>
                     <View style={styles.nameExpenseContainer}>
                        <View style={styles.cardIcon}>
                           <ReceiptIcon
                              width={22.5}
                              height={22.5}
                              fill="black"
                           ></ReceiptIcon>
                        </View>
                        <FlatInput
                           fontWeight="600"
                           placeholder="Expense name"
                           maxLength={26}
                           fontColor="rgba(69,69,69,0.75)"
                           style={{ width: 230 }}
                        ></FlatInput>
                     </View>

                     <View style={styles.nameExpenseContainer}>
                        <View style={styles.cardIcon}>
                           <MoneyIcon
                              width={22.5}
                              height={22.5}
                              fill="black"
                           ></MoneyIcon>
                        </View>
                        <FlatInput
                           fontWeight="800"
                           placeholder="Price"
                           maxLength={10}
                           fontSize={15}
                           width={130}
                           fontColor="rgba(69,69,69,0.75)"
                           style={{
                              width: 230,
                              alignItems: "center",
                              justifyContent: "flex-end",
                              flexDirection: "row",
                           }}
                           type="number-pad"
                        >
                           <View
                              style={{
                                 width: 48,
                                 height: 25,
                                 marginLeft: 25,
                                 marginRight: 10,
                                 backgroundColor: "white",
                                 borderRadius: 5,
                                 alignItems: "center",
                                 justifyContent: "center",
                              }}
                           >
                              <Text
                                 style={{
                                    fontWeight: "800",
                                    fontSize: 12,
                                 }}
                              >
                                 RON
                              </Text>
                           </View>
                        </FlatInput>
                     </View>
                  </View>

                  <View style={styles.detailsContainer}>
                     <Text style={styles.titleText}>Split details</Text>

                     {/* <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        loading={loadingDropDown}
                        mode="BADGE"
                        // searchable={true}
                        placeholder="Select a group"
                        style={{
                           width: 157,
                           height: 5,
                           borderRadius: 10,
                           borderColor: "#979797",
                           fontSize: 7,
                        }}
                        dropDownContainerStyle={{
                           // backgroundColor: "red",
                           width: 157,
                           borderColor: "#979797",
                        }}
                     /> */}
                     <View
                        style={{
                           // flexDirection: "row",
                           marginTop: 35,
                           marginLeft: 41,
                        }}
                     >
                        <DropDownList list={results}></DropDownList>
                     </View>
                  </View>

                  <FlatButton
                     style={{ marginTop: 40 }}
                     title="Add expense"
                     width={260}
                  ></FlatButton>
               </>
            ) : (
               <MaterialIndicator
                  size={40}
                  color="rgba(49,101,255,0.80)"
                  style={{ flex: 1 }}
               ></MaterialIndicator>
            )}
         </View>
      </TouchableWithoutFeedback>
   );
};

const styles = StyleSheet.create({
   container: {
      width: width,
      height: height,
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },

   headerContainer: {
      width: width,
      height: 190,
      backgroundColor: "white",
   },
   groupText: {
      alignItems: "center",
      flexDirection: "row",
      marginLeft: 30,
      marginTop: 71,
      marginBottom: 25,
   },

   titleText: {
      marginLeft: 35,
      marginTop: 29,
      color: "#3165FF",
      fontSize: 20,
      fontWeight: "800",
   },

   title: {
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 20,
   },
   detailsContainer: {
      marginTop: 20,
      width: width - 44,
      height: 227,
      borderRadius: 15,
      backgroundColor: "white",
   },

   nameExpenseContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      justifyContent: "center",
   },

   cardIcon: {
      height: 45,
      width: 45,
      borderRadius: 7,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6.68,

      elevation: 11,
   },
});

export default AddExpenseScreen;
