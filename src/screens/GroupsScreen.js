import React, { useState, useEffect, useRef, useCallback } from "react";
import {
   View,
   Image,
   StyleSheet,
   Text,
   Alert,
   TouchableOpacity,
   Animated,
   Dimensions,
   SafeAreaView,
   FlatList,
   ScrollView,
   RefreshControl,
   ActivityIndicator,
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

import ButtonIcon from "../../assets/icons/navbar/button.svg";
import SearchIcon from "../../assets/icons/friendsscreen/searchIcon.svg";

import TouchableWithAnimation from "../components/TouchableWithAnimation";

import FlatButton from "../components/FlatButton";
import FlatInput from "../components/FlatInput";
import GroupCard from "../components/GroupCard";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ContentLoader, {
   Rect,
   Circle,
   Facebook,
} from "react-content-loader/native";

import { authentication, db } from "../api/firebase/firebase-config";
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

const Tab = createMaterialTopTabNavigator();

const { width, height } = Dimensions.get("window");

const TopBarNavigator = ({ navigation }) => {
   const [results, setResults] = useState([]);
   const [filteredResults, setFilteredResults] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
   const [friendsNumber, setFriendsNumber] = useState(null);
   const [search, setSearch] = useState();

   const [searchBarActive, setSearchBarActive] = useState(false);
   const [loading, setLoading] = useState(false);

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
      return [date, month, year];
   }

   const wait = (timeout) => {
      return new Promise((resolve) => setTimeout(resolve, timeout));
   };

   const getFriends = () => {
      console.log(JSON.stringify(filteredResults[0], null, 3));
   };

   const getGroupsInfo = async () => {
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
                  const nanoSeconds =
                     docGroupDetails.data().Details.createdAt.nanoseconds /
                     1000000000;

                  const createdTimeSeconds =
                     docGroupDetails.data().Details.createdAt.seconds +
                     nanoSeconds;

                  const [day, month, year] = extractTime(createdTimeSeconds);
                  const createdAt = {
                     day: day,
                     month: month,
                     year: year,
                  };
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
                  let numberExpenses = 0;
                  let totalSumExpenses = 0;

                  if (docGroupDetails.data().Expenses) {
                     numberExpenses = docGroupDetails.data().Expenses.length;
                     groupExpenses = docGroupDetails.data().Expenses;

                     groupExpenses.forEach((expense) => {
                        totalSumExpenses =
                           totalSumExpenses + parseFloat(expense.price);
                     });
                  }

                  console.log(JSON.stringify(totalSumExpenses, null, 3));

                  group = {
                     uid: docGroupDetails.id,
                     name: docGroupDetails.data().Details.name,
                     createdAt: createdAt,
                     image: docGroupDetails.data().Details.image,
                     type: docGroupDetails.data().Details.type,
                     members: members,
                     numberExpenses: numberExpenses,
                     total: totalSumExpenses,
                  };
                  // console.log(JSON.stringify(group, null, 3));
                  console.log();
               }
               groups.push(group);
            }
      }
      setResults(groups);
      setFilteredResults(groups);
      setLoading(false);
   };

   const onRefresh = useCallback((firstRender) => {
      if (!firstRender) setRefreshing(true);
      getGroupsInfo();

      if (!firstRender) wait(1000).then(() => setRefreshing(false));
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         onRefresh(true);
         searchFilter("");
         setSearchBarActive(false);
      });
      return unsubscribe;
   }, [navigation]);

   const handlePressCard = (item) => {
      // console.log(JSON.stringify(item, null, 3));
      navigation.navigate({
         name: "GroupIndividual",
         params: { group: item },
         merge: true,
      });
   };

   const onPressDone = () => {
      setSearchBarActive(false);
      searchFilter("");
   };

   const searchFilter = (text) => {
      if (text) {
         const newData = results.filter((item) => {
            const itemData = item.name
               ? item.name.toUpperCase()
               : "".toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
         });
         setFilteredResults(newData);
         setSearch(text);
      } else {
         setFilteredResults(results);
         setSearch(text);
      }
   };

   const renderItem = ({ item }) => {
      return (
         <GroupCard
            style={{ alignSelf: "center", marginTop: 20 }}
            key={item.email}
            name={item.name}
            createdAt={item.createdAt}
            type={item.type}
            image={item.image ? item.image : "none"}
            members={item.members}
            numberExpenses={item.numberExpenses}
            total={item.total}
            onPress={() => handlePressCard(item)}
         ></GroupCard>
      );
   };

   return (
      <SafeAreaView style={styles.topContainer}>
         <View style={styles.topElements}>
            {!searchBarActive ? (
               <Text style={styles.title}>Groups</Text>
            ) : (
               <FlatInput
                  style={{ marginLeft: 25 }}
                  placeholder="Search by group name"
                  value={search}
                  onChangeText={(text) => searchFilter(text)}
               />
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
               {!searchBarActive ? (
                  <TouchableWithAnimation
                     style={{ marginRight: 20 }}
                     onPress={() => setSearchBarActive(true)}
                  >
                     <SearchIcon></SearchIcon>
                  </TouchableWithAnimation>
               ) : null}
               <FlatButton
                  style={{ marginRight: 30 }}
                  onPress={() =>
                     !searchBarActive
                        ? navigation.navigate("CreateGroup")
                        : onPressDone()
                  }
                  duration={150}
                  pressAnimation={0.95}
                  title={searchBarActive ? "Done" : "Create"}
                  height={31}
                  width={65}
                  fontSize={12}
                  radius={searchBarActive ? 9 : null}
               ></FlatButton>
            </View>
         </View>
         {
            !loading ? (
               <SafeAreaView>
                  {filteredResults.length ? (
                     <View style={{ height: height - 190 }}>
                        <FlatList
                           contentContainerStyle={{
                              marginTop: 30,
                              height:
                                 filteredResults.length !== 0
                                    ? 230 * filteredResults.length
                                    : null,
                           }}
                           data={filteredResults}
                           renderItem={renderItem}
                           keyExtractor={(item) => item.uid}
                           scrollEnabled
                           alwaysBounceVertical={false}
                           showsVerticalScrollIndicator={false}
                           // refreshControl={
                           //    <RefreshControl
                           //       refreshing={refreshing}
                           //       onRefresh={onRefresh}
                           //       tintColor={"rgba(49,101,255,0.50)"}
                           //    />
                           // }
                        />
                     </View>
                  ) : (
                     <ScrollView
                        contentContainerStyle={{ marginTop: 60 }}
                        // refreshControl={
                        //    <RefreshControl
                        //       refreshing={refreshing}
                        //       onRefresh={onRefresh}
                        //       tintColor={"rgba(49,101,255,0.80)"}
                        //    />
                        // }
                     >
                        <Text
                           style={{
                              fontSize: 11,
                              color: "rgba(0,0,0,0.60)",
                              alignSelf: "center",
                           }}
                        >
                           No groups to be displayed
                        </Text>
                     </ScrollView>
                  )}
               </SafeAreaView>
            ) : (
               <MaterialIndicator
                  size={40}
                  color="rgba(49,101,255,0.80)"
                  style={{ marginTop: 230 }}
               ></MaterialIndicator>
            )

            /*
             */
         }
      </SafeAreaView>
   );
};
const styles = StyleSheet.create({
   container: {
      width: width,
      height: height,
      // justifyContent:'center',
      alignItems: "center",
      backgroundColor: "rgba(49,101,255,0.03)",
   },
   topContainer: {
      width: width,
      height: 130,
      backgroundColor: "white",
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
   },
   textContainer: {
      marginTop: 25,
      flexDirection: "row",
      // marginLeft: 10
      alignSelf: "flex-start",
      marginLeft: 40,
   },

   numberFriends: {
      color: "rgba(49,101,255,1)",
      fontSize: 20,
      fontWeight: "800",
   },

   labelFriends: {
      color: "#979797",
      marginLeft: 7,
      fontSize: 20,
   },

   topElements: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 35,
      justifyContent: "space-between",
   },
   title: {
      fontSize: 25,
      fontWeight: "bold",
      marginLeft: 35,
   },
   containerTextInput: {
      marginLeft: 40,
      borderRadius: 10,
      width: 237,
      height: 44,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "rgba(49,101,255,0.05)",
   },
});

export default TopBarNavigator;
