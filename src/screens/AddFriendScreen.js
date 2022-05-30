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
   Animated,
   ScrollView,
   Button,
   ActivityIndicator,
   TextInput,
   RefreshControl,
} from "react-native";
import FlatButton from "../components/FlatButton";
import SearchIcon from "../../assets/icons/friendsscreen/searchIcon.svg";
import TouchableWithAnimation from "../components/TouchableWithAnimation";
import BackButton from "../components/BackButton";
import SearchBar from "react-native-searchbar";
import {
   doc,
   onSnapshot,
   setDoc,
   getDoc,
   updateDoc,
   getDocs,
   collection,
   query,
   TimeStamp,
} from "firebase/firestore";
import { authentication, db } from "../api/firebase/firebase-config";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../api/firebase/firebase-config";
import * as Progress from "react-native-progress";
import FriendCard from "../components/FriendCard";

const { width, height } = Dimensions.get("window");

const AddFriendScreen = ({ navigation }) => {
   const [credentials, setCredentials] = useState("");
   const [results, setResults] = useState([]);
   const [filteredResults, setFilteredResults] = useState([]);
   const [imageProfile, setImageProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState();

   useEffect(() => {
      const getUsersInfo = async () => {
         const users = [];
         let user = {};
         let friends = [];
         let friend = {};

         const docUser = await getDocs(collection(db, "Users"));
         if (docUser) {
            docUser.forEach(async (doc) => {
               if (doc.id != authentication.currentUser.email) {
                  user = {
                     email: doc.id,
                     username: doc.data().Account.username,
                     image: doc.data().Account.image,
                  };
                  users.push(user);
               }
            });
         }

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
                     };
                  }
                  friends.push(friend);
               }
         }
         const results = users.filter(
            ({ email, username, image }) =>
               !friends.some(
                  (exclude) =>
                     exclude.email === email &&
                     exclude.username === username &&
                     exclude.image === image
               )
         );
         setResults(results);
         setFilteredResults(results);
      };
      getUsersInfo();
   }, []);
   // setLoading(true);

   const renderItem = ({ item }) => {
      return (
         <FriendCard
            cardType="AddFriends"
            image={item.image}
            username={item.username}
            mail={item.email}
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

   const clearText = () => {
      setSearch("");
      searchFilter("");
   };

   const changeText = (text) => {
      if (text === "") {
         searchFilter("");
         setCredentials("");
      } else setCredentials(text);
   };

   renderListHeader = () => {
      return (
         <View>
            <Text>Foo</Text>
         </View>
      );
   };

   return (
      <View style={styles.container}>
         <SafeAreaView style={styles.topContainer}>
            <View style={styles.topElements}>
               <BackButton
                  style={{ marginLeft: 25 }}
                  onPress={() => navigation.goBack()}
               />
               <Text style={styles.title}>Add Friend</Text>
            </View>
            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
               }}
            >
               <View style={styles.containerTextInput}>
                  <TextInput
                     style={{ marginLeft: 15, fontSize: 14 }}
                     value={credentials}
                     placeholder="Search by email or username"
                     onChangeText={(text) => setCredentials(text)}
                     autoCapitalize="none"
                     keyboardType="email-address"
                     autoCorrect={false}
                  />
               </View>
               <FlatButton
                  style={{ marginLeft: 20 }}
                  onPress={() => searchFilter(credentials)}
                  title="Search"
                  duration={150}
                  pressAnimation={0.97}
                  width={60}
                  height={35}
                  fontSize={12}
                  radius={10}
               ></FlatButton>
            </View>
         </SafeAreaView>

         <SafeAreaView>
            {filteredResults.length ? (
               <FlatList
                  data={filteredResults}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.email}
                  contentContainerStyle={{
                     marginTop: 25,
                     height:
                        filteredResults.length !== 0
                           ? 100 * filteredResults.length
                           : null,
                  }}
                  scrollEnabled={true}
                  alwaysBounceVertical={false}
                  showsVerticalScrollIndicator={false}
               />
            ) : (
               <Text
                  style={{
                     fontSize: 11,
                     color: "rgba(0,0,0,0.60)",
                     marginTop: 60,
                  }}
               >
                  No accounts to be displayed
               </Text>
            )}
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
      height: 210,
      // marginBottom: 25,
      backgroundColor: "white",
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
   },
   topElements: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
   },
   title: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 30,
   },
   containerTextInput: {
      borderRadius: 10,
      width: 237,
      height: 44,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "rgba(49,101,255,0.05)",
   },
});

export default AddFriendScreen;
