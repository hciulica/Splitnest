import React, {useState, useEffect, useRef} from 'react';
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
  Animated
} from 'react-native';
import FlatButton from '../components/FlatButton';
import SearchIcon from '../../assets/icons/friendsscreen/searchIcon.svg';
import TouchableWithAnimation from '../components/TouchableWithAnimation';

const {width, height} = Dimensions.get('window');

const FriendsScreen = ({navigation}) => 
{
    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.topContainer}>
            
            <View style={styles.topElements}>
                <Text style={styles.title}>Friends list</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableWithAnimation style={{marginRight:20}}>
                        <SearchIcon ></SearchIcon>
                    </TouchableWithAnimation>
                    <FlatButton style={{marginRight: 30}} onPress={() => navigation.navigate("AddFriend")} title='Add' height={38} width={60} fontSize={14}></FlatButton>
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
    alignItems:'center',
    backgroundColor: 'rgba(49,101,255,0.03)',
},
topContainer: {
    width: width,
    height: 120,
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
},
topElements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between'
},
title:{
    
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 35,
},

});

export default FriendsScreen;