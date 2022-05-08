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

const {width, height} = Dimensions.get('window');

const FriendsScreen = ({navigation}) => 
{
    return(
        <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>FriendsScreen</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
});

export default FriendsScreen;