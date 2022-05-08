import React from 'react';
import {View, Text, SafeAreaView, Button, TouchableWithoutFeedback,TouchableOpacity, Alert} from 'react-native';
import HomeTabBarButton from '../components/HomeTabBarButton';

const HomeScreen = () => {

    return (
        <SafeAreaView style={{justifyContent:'center', alignItems: 'center', flex: 1}}>
            <Text>HomeScreen</Text>
            <HomeTabBarButton/>
            <TouchableOpacity style={{backgroundColor: 'red', borderRadius: 25, width:250, height: 50, justifyContent: 'center', alignItems: 'center'}} onPress={() => Alert.alert("Ceva")}>
                <Text>Click aici</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

export default HomeScreen;