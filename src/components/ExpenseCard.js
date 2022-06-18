import React, { useState, useEffect, useRef } from "react";
import {
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   TouchableHighlight,
   Text,
   View,
   Animated,
   Image,
   Alert,
} from "react-native";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   arrayUnion,
   arrayRemove,
   serverTimestamp,
   increment,
   autoRefresh,
   Timestamp,
} from "firebase/firestore";

import { authentication, db } from "../api/firebase/firebase-config";

import ExpenseIcon from "../../assets/icons/individualscreen/expenseIcon.svg";

const ExpenseCard = ({ style, addedAt, name, payer, price, members }) => {
   const [sumPay, setSumPay] = useState(null);

   async function getResult() {
      const result = calculateSum();
      return result;
   }

   useEffect(() => {
      var result = new Promise((resolve, reject) => {
         var sum = 0;
         if (members && members.length) {
            members.forEach((member, index, array) => {
               sum = parseFloat(sum) + parseFloat(member.pay);
               if (index === array.length - 1) resolve(sum.toFixed(4));
            });
         }
      });

      //If you are the payer
      var sum = 0;
      if (payer)
         if (payer.email === authentication.currentUser.email) {
            //  const resultSum = getResult();
            //  console.log(resultSum);

            result.then((sum) => {
               setSumPay(sum);
               // setSumPay(sum);
            });
         } else {
            if (members && members.length)
               members.forEach((member) => {
                  if (
                     member.memberInfo.email ===
                     authentication.currentUser.email
                  ) {
                     setSumPay(member.pay);
                  }
               });
         }
   }, [members]);

   return (
      <>
         {addedAt && name && payer && price && members ? (
            <>
               <TouchableWithAnimation
                  style={[styles.containerCard, style]}
                  duration={150}
                  pressAnimation={0.97}
                  onLongPress={() =>
                     Alert.alert(
                        name,
                        "Are you sure you want to pay " +
                           parseFloat(price).toFixed(2),
                        [
                           { text: "Cancel", style: "cancel" },
                           {
                              text: "Pay " + parseFloat(price).toFixed(2),
                              onPress: () => console.log("You paid"),
                              //   style: "destructive",
                           },
                           {
                              text: "Delete",
                              onPress: () => console.log("You paid"),
                              style: "destructive",
                           },
                        ]
                     )
                  }
               >
                  <View style={styles.dateStyle}>
                     <Text style={styles.monthStyle}>{addedAt.month}</Text>
                     <Text style={styles.dayStyle}>{addedAt.day}</Text>
                  </View>
                  <ExpenseIcon style={{ marginLeft: 10 }}></ExpenseIcon>
                  <View style={{ marginLeft: 17, width: 145 }}>
                     <Text style={styles.expenseNameStyle}>{name}</Text>
                     <View
                        style={{
                           flexDirection: "row",
                           alignItems: "center",
                           marginTop: 3,
                        }}
                     >
                        <Text style={styles.payerStyle}>
                           {payer.email === authentication.currentUser.email
                              ? "You"
                              : payer.username.substring(
                                   0,
                                   payer.username.indexOf(" ")
                                ) !== ""
                              ? payer.username.substring(
                                   0,
                                   payer.username.indexOf(" ")
                                )
                              : payer.username.substring(0, 8)}{" "}
                           paid
                        </Text>
                        <Text style={styles.pricePayerStyle}>
                           {parseFloat(price).toFixed(2)}RON
                        </Text>
                     </View>
                  </View>
                  {sumPay !== null ? (
                     <View style={{ alignItems: "flex-end", width: 85 }}>
                        <Text
                           style={[
                              styles.textPayStyle,
                              {
                                 color:
                                    payer.email ===
                                    authentication.currentUser.email
                                       ? "rgba(49,101,255, 0.75)"
                                       : "rgba(255,97,87,1)",
                              },
                           ]}
                        >
                           {payer.email === authentication.currentUser.email
                              ? "You have to receive"
                              : "You have to pay"}
                        </Text>
                        <Text
                           style={[
                              styles.payValueStyle,
                              {
                                 color:
                                    payer.email ===
                                    authentication.currentUser.email
                                       ? "rgba(49,101,255, 0.75)"
                                       : "rgba(255,97,87,1)",
                              },
                           ]}
                        >
                           {sumPay !== null
                              ? parseFloat(sumPay).toFixed(2)
                              : "0.00"}
                           RON
                        </Text>
                     </View>
                  ) : (
                     <Text
                        style={{
                           fontWeight: "bold",
                           fontSize: 10,
                           color: "green",
                           marginLeft: 10,
                        }}
                     >
                        All settled up
                     </Text>
                  )}
               </TouchableWithAnimation>
            </>
         ) : null}
      </>
   );
};

const styles = StyleSheet.create({
   containerCard: {
      width: 336,
      height: 57,
      backgroundColor: "white",
      borderRadius: 15,
      alignItems: "center",
      flexDirection: "row",
   },

   monthStyle: {
      color: "#979797",
      fontWeight: "600",
      fontSize: 11,
   },

   dayStyle: {
      color: "#979797",
      fontWeight: "600",
      fontSize: 15,
   },

   dateStyle: {
      alignItems: "center",
      width: 30,
      marginLeft: 10,
   },

   expenseNameStyle: {
      fontWeight: "bold",
      fontSize: 12,
      color: "black",
   },

   payerStyle: {
      fontWeight: "600",
      fontSize: 10,
      color: "rgba(0,0,0,0.32)",
   },

   pricePayerStyle: {
      fontWeight: "900",
      fontSize: 10,
      color: "rgba(0,0,0,0.32)",
      marginLeft: 3,
   },

   textPayStyle: {
      fontWeight: "bold",
      fontSize: 8,
   },
   payValueStyle: {
      fontWeight: "bold",
      fontSize: 11,
      //   color: "rgba(255,97,87,1)",
   },
});

export default ExpenseCard;
