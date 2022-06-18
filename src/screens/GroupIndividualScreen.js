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
import AddCameraIcon from "../../assets/icons/groupsscreen/addCameraIcon.svg";
import PlusIcon from "../../assets/icons/general/plus.svg";
import PencilEditIcon from "../../assets/icons/general/pencilEdit.svg";

import ImagePicker from "react-native-image-crop-picker";

import InviteCard from "../components/InviteCard";
import ExpenseCard from "../components/ExpenseCard";
import SettleCard from "../components/SettleCard";

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
   const [loadingExpenses, setLoadingExpenses] = useState(false);
   const [loadingMembers, setLoadingMembers] = useState(true);
   const [loadingPay, setLoadingPay] = useState(false);
   const [expensesList, setExpensesList] = useState(null);
   const [payList, setPayList] = useState(null);
   const [loading, setLoading] = useState(false);
   const [percentage, setPercentage] = useState(null);

   var group;
   if (route.params?.group) {
      group = route.params?.group;
   }
   const [groupName, setGroupName] = useState(group.name);
   const [groupImage, setGroupImage] = useState(group.image);
   const [editable, setEditable] = useState(false);

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         navigation.navigate("Expenses");
         setGroupMembers();
      });

      return unsubscribe;
   }, [route.params?.group, route.params?.groupInvited, navigation]);

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

            // console.log(JSON.stringify(group, null, 3));
         });
      }
      setLoadingMembers(false);
   };

   const setGroupExpenses = async () => {
      setLoadingExpenses(true);
      if (route.params?.group) {
         let expensesArray = [];
         let expenseObject = {};
         group = route.params?.group;
         const groupExpenses = await getDocs(
            collection(db, "Groups", group.uid, "Expenses")
         );

         groupExpenses.forEach(async (groupExpense) => {
            const expense = groupExpense.data();

            const addedAt = expense.addedAt;

            const nameExpense = expense.expenseName;
            //Now take the payer

            if (expense.payer) {
               const expensePayerRef = doc(db, "Users", expense.payer);
               const payerSnap = await getDoc(expensePayerRef);
               let payerAccountInfo;
               if (payerSnap.exists()) {
                  payerAccountInfo = {
                     email: payerSnap.id,
                     username: payerSnap.data().Account.username,
                     image: payerSnap.data().Account.image,
                     phone: payerSnap.data().Account.phone,
                  };
               } else console.log("No such document!");

               const priceExpense = expense.price;
               const splitTypeExpense = expense.splitType;

               if (expense.members) {
                  const expenseMembers = expense.members;

                  let member = {};
                  let members = [];

                  expenseMembers.forEach(async (expenseMember) => {
                     const payMember = parseFloat(expenseMember.pay).toFixed(4);
                     const expenseMemberRef = doc(
                        db,
                        "Users",
                        expenseMember.reference
                     );
                     const expenseMemberSnap = await getDoc(expenseMemberRef);

                     let memberAccountInfo;
                     if (expenseMemberSnap.exists()) {
                        memberAccountInfo = {
                           email: expenseMemberSnap.id,
                           username: expenseMemberSnap.data().Account.username,
                           image: expenseMemberSnap.data().Account.image,
                           phone: expenseMemberSnap.data().Account.phone,
                        };
                     } else console.log("No such document");

                     member = {
                        pay: payMember,
                        memberInfo: memberAccountInfo,
                     };

                     members.push(member);
                  });

                  console.log(addedAt);

                  expenseObject = {
                     addedAt: addedAt,
                     name: nameExpense,
                     payer: payerAccountInfo,
                     price: parseFloat(priceExpense).toFixed(4),
                     splitType: splitTypeExpense,
                     members: members,
                  };
               }
            }
            expensesArray.push(expenseObject);
         });

         setExpensesList(expensesArray);

         setTimeout(() => setLoadingExpenses(false), 200);
      }
   };

   const Expenses = ({ navigation, params }) => {
      const calculateProgress = async () => {
         const expensesRef = query(
            collection(db, "Groups", group.uid, "Expenses")
         );
         const querySnapshot = await getDocs(expensesRef);
         let totalOwedPay = 0;
         await querySnapshot.forEach(async (expenses) => {
            console.log(expenses.data());
            const expense = expenses.data();
            if (expense.members) {
               expense.members.forEach((member) => {
                  totalOwedPay =
                     parseFloat(totalOwedPay) + parseFloat(member.pay);
               });
            }
         });
         if (group.total) {
            const divideResult =
               parseFloat(totalOwedPay) / parseFloat(group.total);
            const percentageResult = divideResult * 100;
            console.log(parseFloat(percentageResult).toFixed(2));
            const finalResult = 100 - percentageResult;
            setPercentage(finalResult);

            const docGroupRef = doc(db, "Groups", group.uid);

            await updateDoc(docGroupRef, {
               "Details.progress": finalResult,
            });
         }
      };

      useEffect(() => {
         const unsubscribe = navigation.addListener("focus", () => {
            setGroupExpenses();
            calculateProgress();
         });

         return unsubscribe;
      }, []);

      const renderItem = ({ item }) => {
         return (
            <ExpenseCard
               style={{ marginTop: 16 }}
               addedAt={item.addedAt}
               name={item.name}
               payer={item.payer}
               price={item.price}
               members={item.members}
            />
         );
      };

      return (
         <View
            style={{
               justifyContent: "center",
               alignItems: "center",
            }}
         >
            {/* <Text>Groups all screen</Text> */}
            {loadingExpenses ? (
               <View style={{ justifyContent: "center" }}>
                  <MaterialIndicator
                     size={40}
                     color="rgba(49,101,255,0.80)"
                  ></MaterialIndicator>
               </View>
            ) : (
               <View>
                  {expensesList ? (
                     <FlatList
                        contentContainerStyle={{
                           height:
                              expensesList !== null
                                 ? expensesList.length !== 0
                                    ? 90 * group.numberExpenses
                                    : null
                                 : null,
                           marginTop: 10,
                        }}
                        horizontal={false}
                        data={expensesList}
                        renderItem={renderItem}
                        // keyExtractor={(item) => item.email}
                        showsVerticalScrollIndicator={false}
                        alwaysBounceVertical={false}
                     />
                  ) : (
                     <Text
                        style={{
                           fontWeight: "500",
                           fontSize: 12,
                           color: "#979797",
                           marginTop: 75,
                        }}
                     >
                        No expenses added yet
                     </Text>
                  )}
               </View>
            )}
         </View>
      );
   };

   const setSettle = () => {
      setLoadingPay(true);
      let payersArray = [];
      let resultsDisplay = [];

      expensesList.forEach((expense) => {
         if (expense.payer)
            if (expense.payer.email !== authentication.currentUser.email) {
               payersArray.push(expense.payer);
            }
      });

      payersArray.forEach((payer) => {
         var sum = 0;
         expensesList.forEach((expense) => {
            if (expense.payer)
               if (payer.email === expense.payer.email) {
                  expense.members.forEach((member) => {
                     if (
                        member.memberInfo.email ===
                        authentication.currentUser.email
                     ) {
                        sum = parseFloat(sum) + parseFloat(member.pay);
                     }
                  });
               }
         });

         if (sum != parseFloat(0)) {
            // console.log("You need to pay to", sum, payer.email);

            const settleObject = {
               sumPay: sum,
               payer: payer,
            };
            resultsDisplay.push(settleObject);
         }
      });

      const resultSettle = resultsDisplay.filter(
         (thing, index, self) =>
            index ===
            self.findIndex(
               (t) =>
                  t.sumPay === thing.sumPay &&
                  t.payer.email === thing.payer.email
            )
      );

      setPayList(resultSettle);
      if (resultSettle === null) console.log("NULL PROSTULE");
      else console.log("RESULT SETTLE", resultSettle);
      setLoadingPay(false);
   };

   const Pay = ({ navigation, params }) => {
      useEffect(() => {
         const unsubscribe = navigation.addListener("focus", () => {
            setSettle();
         });

         return unsubscribe;
      }, []);

      const onPressCard = (item) => {
         navigation.navigate("ConfirmPay", {
            paymentInfo: item,
            groupUid: route.params?.group.uid,
         });
      };

      const renderItem = ({ item }) => {
         return (
            <SettleCard
               style={{ marginTop: 15 }}
               name={item.payer.username}
               email={item.payer.email}
               image={item.payer.image}
               sumPay={item.sumPay}
               handlePress={() => onPressCard(item)}
            />
         );
      };

      return (
         <View
            style={{
               justifyContent: "center",
               alignItems: "center",
               flex: 1,
            }}
         >
            {!loadingPay ? (
               <View>
                  {payList && payList.length === 0 ? (
                     <Text
                        style={{
                           fontWeight: "500",
                           fontSize: 12,
                           color: "#979797",
                           marginBottom: 250,
                        }}
                     >
                        All your payments settled up
                     </Text>
                  ) : (
                     <FlatList
                        contentContainerStyle={{
                           marginTop: 15,
                        }}
                        horizontal={false}
                        data={payList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.payer.email}
                        showsVerticalScrollIndicator={false}
                        alwaysBounceVertical={false}
                     />
                  )}
               </View>
            ) : (
               <MaterialIndicator
                  size={40}
                  color="rgba(49,101,255,0.80)"
                  style={{ marginBottom: 230 }}
               ></MaterialIndicator>
            )}
         </View>
      );
   };

   const Members = ({ navigation }) => {
      useEffect(() => {
         setGroupMembers();
      }, []);

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
                     height: 100 * group.members.length,
                  }}
                  horizontal={false}
                  data={group.members}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.email}
                  showsVerticalScrollIndicator={false}
                  alwaysBounceVertical={false}
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
               marginBottom: 10,
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

                  if (isFocused !== 0) navigation.navigate("Expenses");
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
                  if (isFocused !== 1) navigation.navigate("Pay");
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
                  if (isFocused !== 2) navigation.navigate("Members");
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
                  <BackButton
                     onPress={() => {
                        navigation.goBack();
                     }}
                  ></BackButton>
                  <TouchableWithAnimation
                     onPress={() =>
                        console.log(JSON.stringify(payList, null, 3))
                     }
                  >
                     <ThreeDotsIcon style={{ marginLeft: 260 }}></ThreeDotsIcon>
                  </TouchableWithAnimation>
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
                        <AddCameraIcon />
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
                     value={
                        percentage === null
                           ? route.params.group.progress
                           : parseFloat(percentage).toFixed(2)
                     }
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
                           fontWeight: "700",
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
                        marginLeft: 36,
                        width: 140,
                     }}
                  >
                     Spent: {parseFloat(group.total).toFixed(2)}RON
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
      width: 150,
      marginLeft: 53,
   },

   bottomContainer: {
      marginTop: 23,
      flexDirection: "row",
      alignItems: "center",
      // justifyContent: "space-evenly",
   },
});

export default GroupIndividualScreen;
