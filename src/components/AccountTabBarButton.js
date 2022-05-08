import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { authentication, db } from '../api/firebase/firebase-config';

const AccountTabBarButton = ({ children, focused }) => {

    if(!focused)
        return(

            <View style={{ marginTop: 25, marginRight:30, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={{ uri: authentication.currentUser.photoURL }}
                        style = {{ width:30, height:30, borderRadius:100 }}
                    />
                <Text style={{ fontSize: 8, marginTop: 4 }}>Account</Text>
            </View>
        );
    else
        return(

            <View style={{ marginTop: 25, marginRight:30, alignItems: 'center', justifyContent: 'center', height: 50, width: 50}}>
                <View borderWidth={2} borderColor='#3165FF' borderRadius={20}>
                    <Image
                        source={{ uri: authentication.currentUser.photoURL }}
                        style = {{ width:30, height:30, borderRadius:100 }}
                    />
                </View>
                    <Text style={{ fontSize: 8, marginTop: 4, fontWeight: '900', color: '#3165FF'}}>Account</Text>
                
            </View>
        );
        
}


export default AccountTabBarButton;