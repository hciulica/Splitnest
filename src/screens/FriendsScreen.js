import React, { useState, useEffect, useRef, useCallback } from "react";

import {
   SafeAreaView,
   Image,
   StyleSheet,
   FlatList,
   View,
   Text,
   StatusBar,
   TouchableOpacity,
   Dimensions,
   Animated,
   RefreshControl,
   ScrollView,
   TextInput,
   ActivityIndicator,
} from "react-native";

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

import CancelIcon from "../../assets/icons/friendsscreen/cancelIcon.svg";
import FlatButton from "../components/FlatButton";
import SearchIcon from "../../assets/icons/friendsscreen/searchIcon.svg";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import FriendCard from "../components/FriendCard";
import FlatInput from "../components/FlatInput";

import ThreeDotsMenu from "../components/ThreeDotsMenu";

import useFriendsList from "../hooks/useFriendsList";

import { MenuProvider } from "react-native-popup-menu";

const { width, height } = Dimensions.get("window");

const wait = (timeout) => {
   return new Promise((resolve) => setTimeout(resolve, timeout));
};

const FriendsScreen = ({ navigation, route }) => {
   const [results, setResults] = useState([]);
   const [filteredResults, setFilteredResults] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
   const [friendsNumber, setFriendsNumber] = useState(null);
   const [search, setSearch] = useState();
   const [searchBarActive, setSearchBarActive] = useState(false);
   const [loading, setLoading] = useState(false);

   const friendsList = useFriendsList();

   const getFriendsInfo = async () => {
      setLoading(true);
      let friends = [];
      let friend = {};

      const refFriends = doc(db, "Users", authentication.currentUser.email);
      const docFriends = await getDoc(refFriends);

      if (docFriends.exists()) {
         const refFriend = docFriends.data().Friends;
         if (refFriend)
            for (let i = 0; i < refFriend.length; i++) {
               const docFriendAccount = await getDoc(refFriend[i]);
               if (docFriendAccount.exists()) {
                  friend = {
                     email: docFriendAccount.id,
                     username: docFriendAccount.data().Account.username,
                     image: docFriendAccount.data().Account.image,
                     phone: docFriendAccount.data().Account.phone,
                  };
               }
               friends.push(friend);
            }
      }

      setResults(friends);
      setFilteredResults(friends);
      setLoading(false);
   };

   const getNumberFriends = async () => {
      const refAccount = doc(db, "Users", authentication.currentUser.email);
      const docSnap = await getDoc(refAccount);

      if (docSnap.exists()) {
         setFriendsNumber(docSnap.data().Account.numberFriends);
      } else {
         console.log("No such a document!");
      }
   };

   const onRefresh = useCallback((firstRender) => {
      if (!firstRender) setRefreshing(true);

      setSearchBarActive(false);
      getFriendsInfo();
      getNumberFriends();
      if (!firstRender) wait(1000).then(() => setRefreshing(false));
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
         onRefresh(true);
      });
      return unsubscribe;
   }, [navigation]);

   const renderItem = ({ item }) => {
      return (
         <FriendCard
            image={item.image}
            username={item.username}
            mail={item.email}
            phone={item.phone}
            cardType="friends"
            autoRefresh={() => onRefresh(true)}
         />
      );
   };

   const searchFilter = (text) => {
      if (text) {
         const newData = results.filter((item) => {
            const itemData = item.username
               ? item.username.toUpperCase()
               : "".toUpperCase();
            const textData = text.toUpperCase();

            const itemData1 = item.email
               ? item.email.toUpperCase()
               : "".toUpperCase();
            const textData1 = text.toUpperCase();

            return (
               itemData.indexOf(textData) > -1 ||
               itemData1.indexOf(textData1) > -1
            );
         });
         setFilteredResults(newData);
         setSearch(text);
      } else {
         setFilteredResults(results);
         setSearch(text);
      }
   };

   const displayPropsNav = () => {
      console.log(route.params);
   };

   const onPressDone = () => {
      setSearchBarActive(false);
      searchFilter("");
   };

   return (
      <View style={styles.container}>
         <SafeAreaView style={styles.topContainer}>
            <View style={styles.topElements}>
               {!searchBarActive ? (
                  <Text style={styles.title}>Friends list</Text>
               ) : (
                  <FlatInput
                     style={{ marginLeft: 40 }}
                     placeholder="Search by email or username"
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
                           ? navigation.navigate("AddFriend")
                           : onPressDone()
                     }
                     duration={150}
                     pressAnimation={0.95}
                     title={searchBarActive ? "Done" : "Add"}
                     height={38}
                     width={60}
                     fontSize={14}
                  ></FlatButton>
               </View>
            </View>
         </SafeAreaView>
         {!loading ? (
            <>
               <View style={styles.textContainer}>
                  <Text style={styles.numberFriends}>{friendsNumber}</Text>
                  <Text style={styles.labelFriends}>Friends</Text>
               </View>

               <SafeAreaView>
                  {filteredResults.length ? (
                     <View style={{ height: height - 290 }}>
                        <FlatList
                           contentContainerStyle={{
                              height:
                                 filteredResults.length !== 0
                                    ? 80 * filteredResults.length
                                    : null,
                           }}
                           data={filteredResults.sort((a, b) =>
                              a.username.localeCompare(b.username)
                           )}
                           renderItem={renderItem}
                           keyExtractor={(item) => item.email}
                           scrollEnabled
                           alwaysBounceVertical={false}
                           showsVerticalScrollIndicator={false}
                           refreshControl={
                              <RefreshControl
                                 refreshing={refreshing}
                                 onRefresh={onRefresh}
                                 tintColor={"rgba(49,101,255,0.50)"}
                              />
                           }
                        />
                     </View>
                  ) : (
                     <ScrollView
                        contentContainerStyle={{ marginTop: 60 }}
                        refreshControl={
                           <RefreshControl
                              refreshing={refreshing}
                              onRefresh={onRefresh}
                              tintColor={"rgba(49,101,255,0.80)"}
                           />
                        }
                     >
                        <Text
                           style={{ fontSize: 11, color: "rgba(0,0,0,0.60)" }}
                        >
                           No friends to be displayed
                        </Text>
                     </ScrollView>
                  )}
               </SafeAreaView>
            </>
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
      marginBottom: 10,
      flexDirection: "row",

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

export default FriendsScreen;
