import React, {useState, useRef} from 'react';
import {StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, Text, View, Animated} from 'react-native';
import TouchableWithAnimation from '../components/TouchableWithAnimation';

export default function OnboardButton({onPress, title, color}) {

    const animatePress = useRef(new Animated.Value(1)).current;

    const styleButton = color === 'white' ? 
    {borderRadius: 30,
     height: 58, 
     width: 123, 
     backgroundColor: '#FFFFFF',
     justifyContent: 'center',
    }
        : 
    {
         borderRadius: 30,
        height: 58,
        width: 123,
        justifyContent: 'center',
        
    }; 
    

    return (
            <TouchableWithAnimation style={styleButton} duration = {50} pressAnimation = {0.90} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableWithAnimation>
        
    )
}

const styles = StyleSheet.create({
     buttonWhite: {
        borderRadius: 30,
        height: 58,
        width: 123,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    buttonSimple: {
        borderRadius: 30,
        height: 58,
        width: 123,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#000000'
    }
})