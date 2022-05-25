import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet, 
    TouchableOpacity,
    TouchableWithoutFeedback, 
    TouchableHighlight, 
    Text, 
    View, 
    Animated,
    Image

} from 'react-native';

import TouchableWithAnimation from '../components/TouchableWithAnimation';
import AddFriendIcon from '../../assets/icons/friendsscreen/addFriendIcon.svg';
import AddedFriendIcon from '../../assets/icons/friendsscreen/AddedFriend.svg';

import { doc, 
    onSnapshot , 
    setDoc, 
    getDoc, 
    updateDoc, 
    getDocs, 
    collection,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    increment } from 'firebase/firestore';
import {authentication, db} from '../api/firebase/firebase-config';

export default function FriendCard({ name, mail, image, added, onPress }) {
    
    const [pressed, setPressed] = useState(true);

    useEffect (() => {
        const checkIfAdded = async() => {
            const refFriends = doc(db, "Users", authentication.currentUser.email);
                    const docFriends = await getDoc(refFriends);
                    
                    if(docFriends.exists()) {
                        const refFriend = docFriends.data().Friends;
                        if(refFriend)
                        for(let i=0;i < refFriend.length; i++) {
                            const docFriendAccount = await getDoc(refFriend[i]);
                            if(mail === docFriendAccount.id)
                                {setPressed(false); break;}
                        }
                    }
        }
        checkIfAdded();
    }, [])

    const addNewFriendFirestore = async() => {
        try{
            const refUserFriends = doc(db, "Users", authentication.currentUser.email);
            const refFriendFriends = doc(db, "Users", mail);
          
            if(pressed){
                await updateDoc(refUserFriends ,{
                    "Account.numberFriends": increment(1),
                    Friends: arrayUnion(refFriendFriends),
                });

                await updateDoc(refFriendFriends ,{
                    "Account.numberFriends": increment(1),
                        Friends: arrayUnion(refUserFriends),
                });
            }
            
 
        } catch(err)
        {
        console.log(err);
        }
    } 

    const addFriend = () => {
        if(pressed)
        {
            addNewFriendFirestore();
            setPressed(false);
        }
    }

    
    return (
        <View style={styles.containerCard}>
                <Image style={styles.imageProfile} source={{ uri: image}}/>

                <View style={styles.textContainer}>
                    <Text style={styles.nameStyle}>{name}</Text>
                    <Text style={styles.mailStyle}>{mail}</Text>
                </View>
            
                <TouchableWithAnimation style={{alignContent: 'flex-end'}}
                    onPress={() => addFriend()}>
                    {pressed ? <AddFriendIcon/> : 
                            <AddedFriendIcon/>}
                </TouchableWithAnimation>
        </View>
    )
}

const styles = StyleSheet.create({
    
    containerCard: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
        width: 325,
        height: 57,
        backgroundColor: 'white',
        borderRadius: 15
    },
    textContainer: {
        width: 200,
    },
    request: {
        fontSize: 8,
        marginRight: 10,
    },
    imageProfile: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginHorizontal: 20,
        overflow: "hidden",
    },

    nameStyle: {
        fontSize: 13,
        fontWeight: '800'
    },

    mailStyle: {
        marginTop: 5,
        fontSize: 9,
        // color: '#979797',
        color: 'rgba(0,0,0,0.60)'
    },

})