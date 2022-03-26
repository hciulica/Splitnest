import React from 'react';
import {View,StyleSheet} from 'react-native';
import FlatButton from '../components/FlatButton';


const TestScreen = () => {
    return (
        <View>
            <FlatButton text='Sign up'></FlatButton>
        </View>
    )
    
    const styles = StyleSheet.create({
        viewStyle: {
            marginTop:50,
        }
    })

}

export default TestScreen;