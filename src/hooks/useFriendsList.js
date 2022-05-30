import React, { useState, useEffect } from "react";
import { Alert } from "react-native";

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

function useFriendsList() {
   const [results, setResults] = useState([]);

   useEffect(() => {
      const fetchFriends = async () => {
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
      };

      fetchFriends();
   }, []);

   return results;
}

export default useFriendsList;
