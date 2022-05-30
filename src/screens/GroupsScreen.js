import React, { useState, useEffect, useRef } from "react";
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
   TextInput,
} from "react-native";

import ButtonIcon from "../../assets/icons/navbar/button.svg";
import SearchIcon from "../../assets/icons/friendsscreen/searchIcon.svg";

import TouchableWithAnimation from "../components/TouchableWithAnimation";
import FlatButton from "../components/FlatButton";
import FlatInput from "../components/FlatInput";

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

const { width, height } = Dimensions.get("window");

const GroupsScreen = ({ navigation }) => {
   const [results, setResults] = useState([]);
   const [filteredResults, setFilteredResults] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
   const [friendsNumber, setFriendsNumber] = useState(null);
   const [search, setSearch] = useState();
   const [searchBarActive, setSearchBarActive] = useState(false);

   function timeConverter(UNIX_timestamp) {
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
      return time;
   }

   const modifyData = async () => {
      const refAccount = doc(db, "Groups", "01CpU5uraarqBHGmtjoL");
      const docSnap = await getDoc(refAccount);

      const nanoSeconds =
         docSnap.data().Details.createdAt.nanoseconds / 1000000000;
      console.log(nanoSeconds);
      const createdTimeSeconds =
         docSnap.data().Details.createdAt.seconds + nanoSeconds;

      console.log(timeConverter(createdTimeSeconds));
      //   console.log(docSnap.data().Details.createdAt.seconds);
   };

   return (
      <View style={styles.container}>
         <SafeAreaView style={styles.topContainer}>
            <View style={styles.topElements}>
               {!searchBarActive ? (
                  <Text style={styles.title}>Groups</Text>
               ) : (
                  <FlatInput
                     style={{ marginLeft: 25 }}
                     placeholder="Search by group name"
                     //  value={search}
                     //  onChangeText={(text) => searchFilter(text)}
                  />
               )}

               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {!searchBarActive ? (
                     <TouchableWithAnimation
                        style={{ marginRight: 20 }}
                        // onPress={() => setSearchBarActive(true)}
                        onPress={() => modifyData()}
                     >
                        <SearchIcon></SearchIcon>
                     </TouchableWithAnimation>
                  ) : null}
                  <FlatButton
                     style={{ marginRight: 30 }}
                     onPress={() =>
                        !searchBarActive
                           ? navigation.navigate("CreateGroup")
                           : setSearchBarActive(false)
                     }
                     duration={150}
                     pressAnimation={0.95}
                     title={searchBarActive ? "Done" : "Create"}
                     height={31}
                     width={65}
                     fontSize={12}
                  ></FlatButton>
               </View>
            </View>
         </SafeAreaView>
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

export default GroupsScreen;
