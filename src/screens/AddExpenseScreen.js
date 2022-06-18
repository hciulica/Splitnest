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
   Alert,
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

import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

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

import InviteFriendsScreen from "../screens/InviteFriendsScreen";

import { authentication, db } from "../api/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import ImageNew from "../../assets/images/calculator-front-color.png";

import {
   doc,
   onSnapshot,
   addDoc,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   arrayUnion,
   Timestamp,
} from "firebase/firestore";

import ChipCustom from "../components/ChipCustom";

const { width, height } = Dimensions.get("window");

const AddExpenseScreen = ({ navigation, route }) => {
   const [loading, setLoading] = useState(false);
   const [results, setResults] = useState([]);

   const [selectedGroups, setSelectedGroups] = useState([]);
   const [finalGroups, setFinalGroups] = useState([]);
   const [selectedChoice, setSelectedChoice] = useState({
      uid: null,
      image: null,
      name: null,
   });

   const [groupsChecked, setGroupsChecked] = useState(-1);

   const [expenseName, setExpenseName] = useState("");
   const [price, setPrice] = useState(null);

   const [payerDisplay, setPayerDisplay] = useState({
      username: authentication.currentUser.displayName,
      image: authentication.currentUser.photoURL,
      email: authentication.currentUser.email,
   });
   const [splitTypeDisplay, setSplitTypeDisplay] = useState("-");

   const [splitType, setSplitType] = useState("Equally");
   const [payerImageDisplay, setPayerImageDisplay] = useState(null);
   const [animationCheck, setAnimationCheck] = useState(false);

   const addToSelectedGroups = ({ item }) => {
      setGroupsChecked(groupsChecked + 1);
      const toAdd = {
         uid: item.uid,
         name: item.name,
         image: item.image,
      };
      selectedGroups.push(toAdd);

      const connectedUser = {
         email: authentication.currentUser.email,
         image: authentication.currentUser.photoURL,
         username: authentication.currentUser.displayName,
      };
      setGroupMembersAndPayer(item.uid, connectedUser);
      if (price === null) setPrice(parseFloat(1.0).toFixed(2));
   };

   const removeFromSelectedGroups = ({ item }) => {
      setGroupsChecked(groupsChecked - 1);
      setSelectedGroups(
         selectedGroups.filter((results) => results.uid != item.uid)
      );
      if (groupsChecked == 0) {
         setSelectedChoice({ uid: null, image: null, name: null });
      }
   };

   const renderItem = ({ item }) => {
      return (
         <ChipCustom
            name={item.name}
            image={item.image}
            add={() => addToSelectedGroups({ item })}
            remove={() => removeFromSelectedGroups({ item })}
         ></ChipCustom>
      );
   };

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
      setLoading(false);
   };

   //This is called after filter selection is confirmed
   const onPlaceChosen = async (params) => {
      for (let i = 0; i < selectedGroups.length; i++) {
         // console.log("Ajunge aici");

         if (selectedGroups[i].uid === selectedChoice.uid) {
            selectedGroups[i].members = params.groupFiltered;

            const docRefCurrent = doc(
               db,
               "Users",
               authentication.currentUser.email
            );
            const docCurrentSnap = await getDoc(docRefCurrent);

            if (docCurrentSnap.exists()) {
               //Push current User
               const currentUser = {
                  email: docCurrentSnap.id,
                  image: docCurrentSnap.data().Account.image,
                  username: docCurrentSnap.data().Account.username,
               };

               selectedGroups[i].members.push(currentUser);
            }
            const payerSelect = {
               email: authentication.currentUser.email,
               image: authentication.currentUser.photoURL,
               username: authentication.currentUser.displayName,
            };

            console.log(JSON.stringify(selectedGroups[i].members, null, 3));

            const pricePerMember = parseFloat(
               price / (selectedGroups[i].members.length - 1)
            ).toFixed(4);

            selectedGroups[i].members.forEach((member) => {
               if (member.email !== payerSelect.email)
                  member.pay = pricePerMember;
               else member.pay = null;
            });

            selectedChoice.members.forEach((member) => {
               if (member.email !== payerSelect.email)
                  member.pay = pricePerMember;
               else member.pay = null;
            });

            selectedGroups[i].payer = payerSelect;
            selectedChoice.payer = payerSelect;

            selectedGroups[i].splitType = "Equally";
            selectedChoice.splitType = "Equally";

            setPayerDisplay(payerSelect);
            setSplitTypeDisplay("Equally");
         }

         console.log("ASCULTAAAAA!");
      }
   };

   const callBackPayer = (params) => {
      console.log("Callback payer: ");

      if (params.payerMember) {
         const payerSelect = params.payerMember;
         console.log(payerSelect);

         setPayerDisplay(payerSelect);
         setSplitTypeDisplay("Equally");

         selectedGroups.forEach((group) => {
            if (group.uid === selectedChoice.uid) {
               const pricePerMember = parseFloat(
                  price / (group.members.length - 1)
               ).toFixed(4);

               group.members.forEach((member) => {
                  if (member.email !== payerSelect.email)
                     member.pay = pricePerMember;
                  else member.pay = null;
               });

               selectedChoice.members.forEach((member) => {
                  if (member.email !== payerSelect.email)
                     member.pay = pricePerMember;
                  else member.pay = null;
               });

               group.payer = payerSelect;
               selectedChoice.payer = payerSelect;
            }
         });
      }
   };

   const callBackSplit = (params) => {
      if (params.splitType) {
         const splitType = params.splitType;
         console.log(splitType);
         setSplitTypeDisplay(splitType);
         selectedChoice.splitType = splitType;
         //Update in selected groups array
         for (let i = 0; i < selectedGroups.length; i++) {
            if (selectedChoice.uid == selectedGroups.uid) {
               selectedGroups.splitType = splitType;
            }
         }
         setSplitType(params.splitType);
      }
   };

   useEffect(() => {
      if (navigation) {
         getGroups();
      }
   }, [navigation]);

   const handleFilterMembers = () => {
      if (selectedChoice !== null) {
         if (selectedChoice.uid !== null) {
            // if (expenseName.length >= 2 && expenseName != "") {
            if (price >= 1.0 && price !== null) {
               console.log(JSON.stringify(selectedChoice, null, 3));

               navigation.navigate("InviteFriends", {
                  uidGroupFiltered: selectedChoice.uid,
                  onPlaceChosen,
               });
            } else
               Alert.alert(
                  "Expense details",
                  "Please enter the price for the expense"
               );
         } else
            Alert.alert(
               "Expense details",
               "Please enter an expense name of at least 2 characters"
            );
         // } else Alert.alert("No group selected", "Please select a group first");
      } else Alert.alert("No group selected", "Please select a group first");
   };

   const handleAdjustSplit = async () => {
      if (selectedChoice !== null) {
         if (selectedChoice.uid !== null) {
            if (price >= 1.0 && price !== null) {
               navigation.navigate("Split", {
                  membersAdjustSplit: selectedChoice.members.filter(
                     (results) => results.email != selectedChoice.payer.email
                  ),
                  // selectedChoice.members,
                  price: price,
                  callBackSplit,
               });

               // console.log(JSON.stringify(selectedChoice, null, 3));
            } else
               Alert.alert(
                  "Expense details",
                  "Please enter the price for the expense"
               );
         } else Alert.alert("No group selected", "Please select a group first");
      } else Alert.alert("No group selected", "Please select a group first");
   };

   const setGroupMembersAndPayer = async (uid, payer) => {
      var members = [];
      let member = {};
      const groupRef = doc(db, "Groups", uid);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
         const refMembers = groupSnap.data().Members;
         if (refMembers && refMembers.length !== 0) {
            const pricePerMembers = Number.parseFloat(
               price / (refMembers.length - 1)
            ).toFixed(4);

            for (let i = 0; i < refMembers.length; i++) {
               const docGroupMembers = await getDoc(refMembers[i]);
               if (
                  docGroupMembers.exists()
                  // && docGroupMembers.id !== authentication.currentUser.email
               ) {
                  const memberInfo = {
                     email: docGroupMembers.data().Account.email,
                     username: docGroupMembers.data().Account.username,
                     image: docGroupMembers.data().Account.image,
                     pay:
                        docGroupMembers.id !== payer.email
                           ? pricePerMembers
                           : null,
                  };
                  member = memberInfo;
                  member.email = docGroupMembers.id;
                  members.push(member);
               }
            }
         }
         for (let i = 0; i < selectedGroups.length; i++) {
            if (selectedGroups[i].uid === uid) {
               selectedGroups[i].members = members;
               selectedGroups[i].payer = payer;
               selectedGroups[i].splitType = "Equally";

               // setSplitType("Equally");
               // setPayerDisplay(payer);
            }
         }
      } else {
         console.log("No such document");
      }
   };

   function formatDateObject(today) {
      const dayDate = today.getDate();
      const monthDate = today.getMonth();
      const yearDate = today.getFullYear();
      var months = [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec",
      ];
      const monthFormat = months[monthDate];
      const objDate = {
         day: dayDate,
         month: monthFormat,
         year: yearDate,
      };
      return objDate;
   }

   const createExpenseForEachGroup = async () => {
      setAnimationCheck(true);
      console.log("Selected Groups for expense:");
      console.log(JSON.stringify(selectedGroups, null, 3));

      selectedGroups.forEach(async (group) => {
         let membersArray = [];
         const groupRef = doc(db, "Groups", group.uid);

         group.members.forEach((member) => {
            if (member.email != group.payer.email) {
               const refMember = member.email;
               const payMember = member.pay;
               const memberObject = {
                  reference: refMember,
                  pay: parseFloat(payMember),
               };
               if (memberObject.pay !== 0) membersArray.push(memberObject);
            }
         });

         const refPayer = group.payer.email;

         const today = new Date();
         const resultAdded = formatDateObject(today);

         const expense = {
            expenseName: expenseName,
            price: parseFloat(price),
            splitType: group.splitType,
            addedAt: resultAdded,
            payer: refPayer,
            members: membersArray,
         };

         const subColRef = collection(groupRef, "Expenses");
         await addDoc(subColRef, expense);
      });
   };

   return (
      <>
         {!animationCheck ? (
            <TouchableWithoutFeedback
               onPress={() => {
                  Keyboard.dismiss();
               }}
               accessible={false}
            >
               <View style={styles.container}>
                  <View style={styles.headerContainer}>
                     <View style={styles.groupText}>
                        <TouchableWithAnimation
                           style={{ padding: 10 }}
                           onPress={() => navigation.goBack()}
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
                        <Text style={styles.subtitle}>Groups:</Text>
                        <FlatList
                           horizontal
                           data={results}
                           renderItem={renderItem}
                           keyExtractor={(item) => item.uid}
                           showsHorizontalScrollIndicator={false}
                           alwaysBounceHorizontal={false}
                        />
                     </View>
                  </View>
                  {!loading ? (
                     <>
                        <View style={styles.detailsContainer}>
                           <Text style={styles.titleText}>Expense details</Text>
                           <View style={styles.fieldsExpenseContainer}>
                              <View style={styles.cardIcon}>
                                 <ReceiptIcon
                                    width={22.5}
                                    height={22.5}
                                    fill="black"
                                 ></ReceiptIcon>
                              </View>
                              <FlatInput
                                 value={expenseName}
                                 onChangeText={(text) => setExpenseName(text)}
                                 // editable={selectedGroups.length === 0 ? true : false}
                                 fontWeight="600"
                                 placeholder="Expense name"
                                 autoCapitalize="words"
                                 maxLength={18}
                                 fontColor="rgba(69,69,69,0.75)"
                                 style={{ width: 230 }}
                                 type="default"
                              ></FlatInput>
                           </View>

                           <View style={styles.fieldsExpenseContainer}>
                              <View style={styles.cardIcon}>
                                 <MoneyIcon
                                    width={22.5}
                                    height={22.5}
                                    fill="black"
                                 ></MoneyIcon>
                              </View>
                              <FlatInput
                                 value={price}
                                 onChangeText={(price) => {
                                    setPrice(price);
                                 }}
                                 onBlur={() => {
                                    const currentPrice =
                                       Number.parseFloat(price);
                                    if (
                                       currentPrice === 0.0 ||
                                       currentPrice === "" ||
                                       isNaN(currentPrice)
                                    ) {
                                       setPrice(
                                          Number.parseFloat(1).toFixed(2)
                                       );
                                    } else
                                       setPrice(
                                          Number.parseFloat(price).toFixed(2)
                                       );

                                    const currentUser = {
                                       email: authentication.currentUser.email,
                                       image: authentication.currentUser
                                          .photoURL,
                                       username:
                                          authentication.currentUser
                                             .displayName,
                                    };
                                    selectedGroups.forEach((group) => {
                                       setGroupMembersAndPayer(
                                          group.uid,
                                          currentUser
                                       );
                                    });

                                    setSplitTypeDisplay("Equally");
                                    setPayerDisplay(currentUser);
                                 }}
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
                                 <View style={styles.boxStyleRon}>
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

                           <View style={styles.splitDetailsFirstContainer}>
                              <DropDownList
                                 list={selectedGroups}
                                 choiceSelected={(group) => {
                                    setSelectedChoice(group);
                                    setSplitTypeDisplay(group.splitType);
                                    setPayerDisplay(group.payer);
                                 }}
                              ></DropDownList>

                              <FlatButton
                                 title="Filter"
                                 disabled={
                                    selectedChoice.uid == null ? true : false
                                 }
                                 onPress={() => handleFilterMembers()}
                                 height={30}
                                 width={78}
                                 fontSize={12}
                                 radius={15}
                                 duration={150}
                                 pressAnimation={0.97}
                                 style={{ marginLeft: 10, marginTop: 2 }}
                              ></FlatButton>
                           </View>
                           <View
                              style={{
                                 flexDirection: "row",
                                 alignItems: "center",
                                 marginTop: 32,
                                 marginLeft: 37,
                              }}
                           >
                              <Text style={{ fontWeight: "bold" }}>
                                 Paid by
                              </Text>

                              <TouchableOpacity
                                 activeOpacity={0.7}
                                 style={[
                                    styles.boxShadowStyle,
                                    {
                                       width: 65,
                                       flexDirection: "row",
                                       alignItems: "center",
                                       justifyContent: "center",
                                    },
                                 ]}
                                 onPress={async () => {
                                    navigation.navigate("Payer", {
                                       membersSelected: selectedChoice.members,
                                       callBackPayer,
                                    });
                                 }}
                                 disabled={
                                    selectedChoice.uid === null ? true : false
                                 }
                              >
                                 <Text
                                    numberOfLines={1}
                                    style={{
                                       fontSize: 10,
                                       fontWeight: "400",
                                       width: 60,
                                       textAlign: "center",
                                    }}
                                 >
                                    {selectedChoice.payer
                                       ? payerDisplay.email ===
                                         authentication.currentUser.email
                                          ? "You"
                                          : payerDisplay.username
                                       : "-"}
                                 </Text>
                              </TouchableOpacity>

                              <Text
                                 style={{ fontWeight: "bold", marginLeft: 10 }}
                              >
                                 and split
                              </Text>

                              <TouchableOpacity
                                 activeOpacity={0.7}
                                 style={[styles.boxShadowStyle, { width: 65 }]}
                                 disabled={
                                    selectedChoice.uid === null ? true : false
                                 }
                                 onPress={() => handleAdjustSplit()}
                              >
                                 <Text
                                    style={{
                                       fontSize: 10,
                                       fontWeight: "400",
                                       width: 60,
                                       textAlign: "center",
                                    }}
                                 >
                                    {selectedChoice.uid !== null
                                       ? splitTypeDisplay
                                       : "-"}
                                 </Text>
                              </TouchableOpacity>
                           </View>
                        </View>

                        <FlatButton
                           style={{ marginTop: 40 }}
                           title="Add expense"
                           disabled={
                              selectedGroups.length === 0 ||
                              !price ||
                              price === "" ||
                              expenseName.length < 2
                                 ? true
                                 : false
                           }
                           width={260}
                           duration={150}
                           pressAnimation={0.97}
                           onPress={() => {
                              createExpenseForEachGroup();
                              setTimeout(() => navigation.goBack(), 3000);
                           }}
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
         ) : (
            <SafeAreaView style={{ alignItems: "center", marginTop: 100 }}>
               <Text style={{ fontWeight: "700", fontSize: 25 }}>
                  Expense added
               </Text>
               <Image
                  style={{
                     width: 150,
                     height: 150,
                     justifyContent: "center",
                     marginTop: 75,
                  }}
                  source={require("../../assets/gif/gifAllDone.gif")}
               ></Image>

               <View
                  style={{
                     alignItems: "center",
                     marginTop: 30,
                     height: 280,
                  }}
               >
                  {selectedGroups.map((group) => {
                     return (
                        <View key={group.key}>
                           <Text
                              style={{
                                 fontWeight: "200",
                                 fontSize: 13,
                                 marginTop: 10,
                              }}
                           >
                              {group.name}
                           </Text>
                        </View>
                     );
                  })}
               </View>
               <View style={{ alignItems: "center" }}>
                  <Text style={{ fontWeight: "400", fontSize: 25 }}>
                     {expenseName}
                  </Text>

                  <Text
                     style={{
                        marginTop: 20,
                        fontWeight: "800",
                        fontSize: 25,
                     }}
                  >
                     {price}RON
                  </Text>
               </View>
            </SafeAreaView>
         )}
      </>
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

   fieldsExpenseContainer: {
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

   subtitle: {
      marginLeft: 30,
      marginRight: 10,
      fontSize: 15,
      fontWeight: "600",
      color: "#979797",
   },

   boxStyleRon: {
      width: 48,
      height: 25,
      marginLeft: 25,
      marginRight: 10,
      backgroundColor: "white",
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
   },

   splitDetailsFirstContainer: {
      marginTop: 35,
      marginLeft: 41,
      flexDirection: "row",
      zIndex: 2,
   },

   boxShadowStyle: {
      height: 26,

      borderRadius: 5,
      marginLeft: 10,
      backgroundColor: "white",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 1.5,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      justifyContent: "center",
      alignItems: "center",

      elevation: 3,
   },
});

export default AddExpenseScreen;
