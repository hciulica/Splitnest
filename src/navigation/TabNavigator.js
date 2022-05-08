import React, {useState, useEffect, useRef} from 'react';
import { View , Image, StyleSheet, Text, TouchableOpacity, Animated, Dimensions} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import AccountScreen from '../screens/AccountScreen';

import HomeIconUnfocused from '../../assets/icons/navbar/home-unfocused.svg';
import HomeIconFocused from '../../assets/icons/navbar/home-focused.svg';
import GroupsIconUnfocused from '../../assets/icons/navbar/groups-unfocused.svg';
import GroupsIconFocused from '../../assets/icons/navbar/groups-focused.svg';
import FriendsIconUnfocused from '../../assets/icons/navbar/friends-unfocused.svg';
import FriendsIconFocused from '../../assets/icons/navbar/friends-focused.svg';

import PlusTabBarButton from '../components/PlusTabBarButton';
import AccountTabBarButton from '../components/AccountTabBarButton';
import HomeTabBarButton from '../components/HomeTabBarButton';

import Feather from 'react-native-vector-icons/Feather';

import {getStorage, uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {updateProfile, signOut, deleteUser} from 'firebase/auth';
import {storage} from '../api/firebase/firebase-config';
import {authentication, db} from '../api/firebase/firebase-config';


const homeName = 'Home';
const groupsName = 'Groups';
const buttonName = 'Button';
const friendsName = 'Friends'; 
const accountName = 'Account';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const {width, height} = Dimensions.get('window');

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen component={AccountScreen} name="Account"></Stack.Screen>
        </Stack.Navigator>
    )
}


const TabNavigator =  () => {

    const [imageAccount, setImageAccount] = useState('');

    useEffect (() => {
        
        const folderName = authentication.currentUser.email;
        const storageRef = ref(storage, `${folderName}/Profile/Profile_image.png`);
        getDownloadURL(storageRef)
        .then((image) => {
            setImageAccount(image);
        })
        
    })

    return(
        
        <Tab.Navigator
            screenOptions={ ({route}) => ({
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: '#4674FF',
                tabBarInactiveTintColor: '#000000',
                tabBarStyle: { 
                    position: 'absolute', 
                    borderRadius: 27, 
                    width: 348, 
                    height: 74, 
                    left: (width-348)/2, 
                    bottom: 38,
                    elevation: 0,
                    shadow:{
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 1,
                    // shadowBlur: 20,
                    elevation: 5,
                    }
                },
                tabBarIcon: ({color, size, focused, navigation}) => {
                    let iconName;
                    let rn = route.name;
                
                    if(rn == homeName){
                        if(focused) 
                        return (
                            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 30, marginLeft:10}}>
                                <HomeIconFocused fill={color} /> 
                                <Text style={{fontSize: 8, marginTop: 8, fontWeight: '900', color: '#3165FF'}}>Home</Text>
                           </View>
                        )
                    else
                        return (
                         <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 30, marginLeft:10}}>
                                <HomeIconUnfocused fill={color} /> 
                                <Text style={{fontSize: 8, marginTop: 8}}>Home</Text>
                           </View>
                        )
                        return <HomeTabBarButton focused={focused} fill={color}/>
                    }
                    if(rn == groupsName){
                        if(focused) 
                         return (
                         <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 30}}>
                                <GroupsIconFocused fill={color} /> 
                                <Text style={{fontSize: 8, marginTop: 8, fontWeight: '900', color: '#3165FF'}}>Groups</Text>
                           </View>
                        )
                            else
                        return (
                         <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 30}}>
                                <GroupsIconUnfocused fill={color} /> 
                                <Text style={{fontSize: 8, marginTop: 8}}>Groups</Text>
                           </View>
                        )
                    }

                    if(rn == friendsName){
                        if(focused) 
                        return (
                         <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 31, marginRight: 25,}}>
                                <FriendsIconFocused fill={color} /> 
                                <Text style={{fontSize: 8, marginTop: 8, fontWeight: '900', color: '#3165FF'}}>Friends</Text>
                           </View>
                        )
                            else
                        
                        return (
                         <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 31, marginRight: 25}}>
                                <FriendsIconUnfocused fill={color} /> 
                                <Text style={{fontSize: 8, marginTop: 8}}>Friends</Text>
                           </View>
                        )
                    }

                    if(rn == accountName){
                        return <AccountTabBarButton focused={focused}/>
                    }
                }
            })}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Groups" component={GroupsScreen}/>
            <Tab.Screen name="Button" component={GroupsScreen}
                options={{
                    tabBarButton: props => (
                        <PlusTabBarButton {...props}/>
                    )
                }}
            />
            <Tab.Screen name="Friends" component={FriendsScreen}/>
            <Tab.Screen name="Account" component={AccountScreen}/>
        </Tab.Navigator>
    )

    const styles = StyleSheet.create({
        textTab: {
            fontSize: 9,
        },
    });
}

export default TabNavigator;