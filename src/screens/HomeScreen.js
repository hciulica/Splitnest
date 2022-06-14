import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   SafeAreaView,
   Button,
   ActivityIndicator,
   TouchableWithoutFeedback,
   TouchableOpacity,
   Alert,
   Image,
   Dimensions,
   StyleSheet,
   Pressable,
   FlatList,
} from "react-native";

import { ScrollView } from "react-native-virtualized-view";

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

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   where,
   orderBy,
} from "firebase/firestore";

import TouchableWithAnimation from "../components/TouchableWithAnimation";
import ActivityCard from "../components/ActivityCard";

import { authentication, db } from "../api/firebase/firebase-config";
import CalendarIcon from "../../assets/icons/homescreen/calendarIcon.svg";
import PiggyIcon from "../../assets/icons/homescreen/piggyIcon.svg";
import PayOweIcon from "../../assets/icons/homescreen/payOweIcon.svg";
import MoneyIcon from "../../assets/icons/homescreen/moneyIcon.svg";
import CardIcon from "../../assets/icons/homescreen/cardIcon.svg";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation, route }) => {
   const [todayDate, setTodayDate] = useState(null);
   const [spentToday, setSpentToday] = useState(0);
   const [paymentsMade, setPaymentsMade] = useState(0);
   const [amountOwed, setAmountOwed] = useState(0);
   const [paymentsOwed, setPaymentsOwed] = useState(0);
   const [activityList, setActivityList] = useState([]);

   const [loading, setLoading] = useState(false);

   const consoleAuthentication = () => {
      console.log(JSON.stringify(authentication.currentUser, null, 3));
   };

   function formatDate(today) {
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
      return monthFormat + " " + dayDate + ", " + yearDate;
   }

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
         date: dayDate,
         month: monthFormat,
         year: yearDate,
      };
      return objDate;
   }

   function extractTime(UNIX_timestamp) {
      var a = new Date(UNIX_timestamp * 1000);
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
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
         date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
      const obj = {
         date: date,
         month: month,
         year: year,
      };
      return obj;
   }

   const fetchDayUpdates = async () => {
      let today = new Date();
      const docRef = doc(db, "Users", authentication.currentUser.email);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         const timeServer = docSnap.data().Account.spentToday.date;
         const nanoSeconds = timeServer.nanoseconds / 1000000000;
         const createdTimeSeconds = timeServer.seconds + nanoSeconds;
         const timeConverted = extractTime(createdTimeSeconds);
         const todayConverted = formatDateObject(today);

         if (JSON.stringify(todayConverted) !== JSON.stringify(timeConverted)) {
            const newObject = {
               date: today,
               spent: 0,
            };
            await updateDoc(docRef, {
               "Account.spentToday": newObject,
               "Account.paymentsMade": 0,
            });
            setSpentToday(0);
            setPaymentsMade(0);
         } else {
            setSpentToday(docSnap.data().Account.spentToday.spent);
            setPaymentsMade(docSnap.data().Account.paymentsMade);
         }
      }
   };

   const fetchOwed = async () => {
      let totalSumOwed = 0;
      let totalPaymentsOwed = 0;
      const groupsRef = query(collection(db, "Groups"));
      const querySnapshot = await getDocs(groupsRef);
      querySnapshot.forEach(async (doc) => {
         // doc.data() is never undefined for query doc snapshots
         const expenseRef = query(
            collection(db, "Groups", doc.id, "Expenses"),
            where("payer", "!=", authentication.currentUser.email)
         );

         const querySnapshotExpenses = await getDocs(expenseRef);
         await querySnapshotExpenses.forEach(async (expense) => {
            expense.data().members.forEach((member) => {
               if (member.reference === authentication.currentUser.email) {
                  totalSumOwed = parseFloat(totalSumOwed) + member.pay;
                  totalPaymentsOwed = totalPaymentsOwed + 1;
               }
            });
         });
         setAmountOwed(parseInt(totalSumOwed));
         setPaymentsOwed(parseInt(totalPaymentsOwed));
      });
   };

   async function sumFunct(a, b) {
      return new Promise(parseFloat(a) + parseFloat(b));
   }

   // var result = new Promise((resolve, reject) => {
   //       var sum = 0;

   // })
   const unionPrices = async () => {
      await fetchActivityList();

      let newList = activityList;
      let auxList = [];
      setActivityList([]);

      for (let i = 0; i < newList.length; i++) {
         const element = newList[i];
         let sw = 1;
         for (let j = i + 1; j < newList.length; j++) {
            const elementAfter = newList[j];
            console.log(elementAfter.groupUid);
            if (
               element.groupUid === elementAfter.groupUid &&
               element.payerRef === elementAfter.payerRef
            ) {
               sw = 0;
               console.log("AICI");

               // await sumFunct(element.pay, elementAfter.pay).then((result) => {
               //    elementAfter.pay = result;
               // });
               elementAfter.pay =
                  parseFloat(elementAfter.pay) + parseFloat(element.pay);

               console.log(elementAfter.pay);
               setTimeout(() => {
                  () => {}, 10;
               });
            }
         }

         if (sw == 1) auxList.push(element);
      }
      setTimeout(() => {
         setActivityList(auxList);
         console.log(JSON.stringify(auxList, null, 3));
      }, 50);
   };

   const fetchActivityList = async () => {
      let payerLists = [];
      const groupsRef = query(collection(db, "Groups"));
      const querySnapshot = await getDocs(groupsRef);

      let resultObject = {};
      querySnapshot.forEach(async (doc) => {
         // doc.data() is never undefined for query doc snapshots
         const expenseRef = query(
            collection(db, "Groups", doc.id, "Expenses"),
            where("payer", "!=", authentication.currentUser.email)
         );
         const querySnapshotExpenses = await getDocs(expenseRef);
         await querySnapshotExpenses.forEach(async (expense) => {
            const expenseInfo = expense.data();

            expenseInfo.members.forEach((member) => {
               if (member.reference === authentication.currentUser.email) {
                  resultObject = {
                     groupUid: doc.id,
                     groupName: doc.data().Details.name,
                     pay: member.pay,
                     payerRef: expense.data().payer,
                  };
                  payerLists.push(resultObject);
               }
            });
         });
      });

      setTimeout(() => setActivityList(payerLists), 5);
   };

   const setResultActivityList = async () => {
      await unionPrices();
   };

   useEffect(() => {
      setLoading(true);
      let today = new Date();
      const unsubscribe = navigation.addListener("focus", () => {
         fetchOwed();
         fetchDayUpdates();
         const resultDate = formatDate(today);
         setTodayDate(resultDate);

         // resultPayerLists.then((list) => {
         //    setTimeout(() => {
         //       console.log(list);
         //    }, 200);
         // });

         // setResultActivityList();

         fetchActivityList();
         // unionPrices();

         // setResultActivityList();

         // fetchActivityList();

         // console.log(JSON.stringify(activityList, null, 3));

         setLoading(false);
      });
      return unsubscribe;
   }, [navigation]);

   const redirectToGroup = async (groupUid) => {
      const docRef = doc(db, "Groups", groupUid);
      const docGroupDetails = await getDoc(docRef);

      if (docGroupDetails.exists()) {
         const nanoSeconds =
            docGroupDetails.data().Details.createdAt.nanoseconds / 1000000000;

         const createdTimeSeconds =
            docGroupDetails.data().Details.createdAt.seconds + nanoSeconds;

         const createdAt = extractTime(createdTimeSeconds);

         const progress = docGroupDetails.data().Details.progress;
         const refMembers = docGroupDetails.data().Members;

         let members = [];
         let member = {};

         if (refMembers)
            for (let i = 0; i < refMembers.length; i++) {
               const docGroupMembers = await getDoc(refMembers[i]);
               if (docGroupMembers.exists()) {
                  const memberInfo = {
                     email: docGroupMembers.data().Account.email,
                     username: docGroupMembers.data().Account.username,
                     phone: docGroupMembers.data().Account.phone,
                     image: docGroupMembers.data().Account.image,
                  };
                  member = memberInfo;
                  member.email = docGroupMembers.id;
                  members.push(member);
               }
            }
         const groupId = docGroupDetails.id;
         let numberExpenses = 0;
         let totalSumExpenses = 0;

         const groupExpenses = await getDocs(
            collection(db, "Groups", groupId, "Expenses")
         );

         groupExpenses.forEach((expense) => {
            totalSumExpenses =
               totalSumExpenses + parseFloat(expense.data().price);

            numberExpenses++;
         });

         const groupRedirect = {
            uid: docGroupDetails.id,
            name: docGroupDetails.data().Details.name,
            createdAt: createdAt,
            image: docGroupDetails.data().Details.image,
            type: docGroupDetails.data().Details.type,
            members: members,
            numberExpenses: numberExpenses,
            total: totalSumExpenses,
            progress: progress,
         };

         navigation.navigate("Groups", {
            redirectParams: groupRedirect,
         });
      }
   };

   const renderItem = ({ item }) => {
      return (
         <ActivityCard
            style={{ marginTop: 20 }}
            groupName={item.groupName}
            groupUid={item.groupUid}
            pay={item.pay}
            payerRef={item.payerRef}
            onPress={() => redirectToGroup(item.groupUid)}
         ></ActivityCard>
      );
   };

   return (
      <>
         <FlatList
            ListHeaderComponent={
               <>
                  <View
                     style={{
                        width: width,
                        height: 410,
                        backgroundColor: "white",
                        marginBottom: 60,
                        borderRadius: 15,
                     }}
                  >
                     <View
                        style={{
                           marginLeft: 22,
                           marginTop: 67,
                           flexDirection: "row",
                           alignItems: "center",
                        }}
                     >
                        <Text style={styles.dateStyle}>{todayDate}</Text>
                        <CalendarIcon style={{ marginLeft: 12 }}></CalendarIcon>
                     </View>
                     <Text style={styles.todayStyle}>Today</Text>
                     <View
                        style={{
                           alignItems: "center",
                           justifyContent: "center",
                           flexDirection: "row",
                           marginTop: 20,
                        }}
                     >
                        <TouchableWithAnimation
                           // onPress={async () => await fetchOwed()}
                           style={[
                              styles.todayCardStyle,

                              {
                                 backgroundColor: "rgba(49, 101, 255, 0.75)",
                                 alignItems: "center",
                                 justifyContent: "center",
                              },
                           ]}
                        >
                           <PiggyIcon
                              style={{
                                 alignSelf: "flex-end",

                                 position: "absolute",
                                 bottom: 0,
                                 top: 12,
                                 left: 112,
                                 right: 0,
                              }}
                           ></PiggyIcon>
                           <View
                              style={{
                                 flexDirection: "row",
                                 alignItems: "flex-end",
                                 justifyContent: "center",
                              }}
                           >
                              <Text
                                 style={[
                                    styles.valueCardStyle,
                                    {
                                       fontSize:
                                          parseInt(amountOwed) >= 0 &&
                                          parseInt(amountOwed) <= 99
                                             ? 30
                                             : parseInt(amountOwed) >= 100 &&
                                               parseInt(amountOwed) <= 999
                                             ? 28
                                             : 22,
                                    },
                                 ]}
                              >
                                 {amountOwed}
                              </Text>
                              <Text
                                 style={[styles.ronCardStyle, { fontSize: 10 }]}
                              >
                                 RON
                              </Text>
                           </View>
                           <Text style={styles.amountOwedStyle}>
                              Amount owed
                           </Text>
                        </TouchableWithAnimation>
                        <TouchableWithAnimation
                           onPress={() =>
                              console.log(JSON.stringify(activityList, null, 3))
                           }
                           style={[
                              styles.todayCardStyle,
                              {
                                 backgroundColor: "rgba(255, 206, 147, 0.75)",
                                 alignItems: "center",
                                 justifyContent: "center",
                              },
                           ]}
                        >
                           <PayOweIcon
                              style={{
                                 alignSelf: "flex-end",

                                 position: "absolute",
                                 bottom: 0,
                                 top: 12,
                                 left: 112,
                                 right: 0,
                              }}
                           ></PayOweIcon>

                           <Text
                              style={[
                                 styles.valueCardStyle,
                                 {
                                    fontSize:
                                       parseInt(paymentsOwed) >= 0 &&
                                       parseInt(paymentsOwed) <= 99
                                          ? 30
                                          : parseInt(paymentsOwed) >= 100 &&
                                            parseInt(paymentsOwed) <= 999
                                          ? 28
                                          : 22,
                                 },
                              ]}
                           >
                              {paymentsOwed}
                           </Text>

                           <Text style={styles.amountOwedStyle}>
                              Payments owed
                           </Text>
                        </TouchableWithAnimation>
                     </View>
                     <View
                        style={{
                           alignItems: "center",
                           justifyContent: "center",
                           flexDirection: "row",
                        }}
                     >
                        <TouchableWithAnimation
                           onPress={() => unionPrices()}
                           style={[
                              styles.todayCardStyle,
                              {
                                 backgroundColor: "rgba(97, 200, 119, 0.75)",
                                 justifyContent: "center",
                                 alignItems: "center",
                              },
                           ]}
                        >
                           <CardIcon
                              style={{
                                 alignSelf: "flex-end",

                                 position: "absolute",
                                 bottom: 0,
                                 top: 12,
                                 left: 112,
                                 right: 0,
                              }}
                           ></CardIcon>

                           <Text
                              style={[
                                 styles.valueCardStyle,
                                 {
                                    fontSize:
                                       paymentsMade >= 0 && paymentsMade <= 99
                                          ? 30
                                          : paymentsMade >= 100 &&
                                            paymentsMade <= 999
                                          ? 28
                                          : 22,
                                 },
                              ]}
                           >
                              {paymentsMade}
                           </Text>

                           <Text style={styles.amountOwedStyle}>
                              Payments made
                           </Text>
                        </TouchableWithAnimation>
                        <TouchableWithAnimation
                           style={[
                              styles.todayCardStyle,
                              {
                                 backgroundColor: "rgba(255, 97, 87, 0.75)",
                                 justifyContent: "center",
                                 alignItems: "center",
                              },
                           ]}
                        >
                           <MoneyIcon
                              style={{
                                 alignSelf: "flex-end",

                                 position: "absolute",
                                 bottom: 0,
                                 top: 12,
                                 left: 112,
                                 right: 0,
                              }}
                           ></MoneyIcon>
                           <View
                              style={{
                                 flexDirection: "row",
                                 alignItems: "flex-end",
                                 justifyContent: "center",
                              }}
                           >
                              <Text
                                 style={[
                                    styles.valueCardStyle,
                                    {
                                       fontSize:
                                          parseInt(spentToday) >= 0 &&
                                          parseInt(spentToday) <= 99
                                             ? 30
                                             : parseInt(spentToday) >= 100 &&
                                               parseInt(spentToday) <= 999
                                             ? 28
                                             : 22,
                                    },
                                 ]}
                              >
                                 {parseInt(spentToday)}
                              </Text>
                              <Text
                                 style={[
                                    styles.ronCardStyle,
                                    {
                                       fontSize: 10,
                                    },
                                 ]}
                              >
                                 RON
                              </Text>
                           </View>
                           <Text style={styles.amountOwedStyle}>
                              Total spent
                           </Text>
                        </TouchableWithAnimation>
                     </View>
                     <Text style={styles.activityLabel}>Activity</Text>
                  </View>
               </>
            }
            // ListFooterComponent={}
            style={{ marginBottom: 100 }}
            ListFooterComponentStyle={{ marginLeft: 20 }}
            nestedScrollEnabled={true}
            horizontal={false}
            data={activityList}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            // scrollToOffset={}
         />
      </>
   );
};

const styles = StyleSheet.create({
   activityLabel: {
      marginLeft: 28,
      marginTop: 40,
      marginBottom: 30,
      fontSize: 20,
      fontWeight: "bold",
   },
   dateStyle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#979797",
   },
   todayStyle: {
      marginLeft: 30,
      marginTop: 26,
      fontWeight: "bold",
      fontSize: 30,
   },

   todayCardStyle: {
      height: 91,
      width: 147,
      borderRadius: 25,
      marginHorizontal: 13,
      marginVertical: 12,
   },

   valueCardStyle: {
      // fontSize: 30,
      fontWeight: "900",
      color: "white",
   },

   ronCardStyle: {
      fontWeight: "500",
      marginBottom: 7,
      color: "white",
   },
   amountOwedStyle: {
      fontSize: 13,
      color: "white",
      fontWeight: "600",
      marginTop: 5,
   },
});

export default HomeScreen;
