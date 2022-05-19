import React, {useState, useRef} from 'react';
import {StyleSheet, TouchableOpacity,TouchableWithoutFeedback, TouchableHighlight, Text, View, Animated} from 'react-native';
import TouchableWithAnimation from '../components/TouchableWithAnimation';
import BackIcon from '../../assets/icons/general/backIcon.svg';

export default function BackButton({ title, onPress, navigation, style }) {
    
    return (
        <TouchableWithAnimation onPress={onPress} 
            style={[ style, styles.buttonLayout ]}>
            <BackIcon width={24}></BackIcon>
        </TouchableWithAnimation>
    )
}

const styles = StyleSheet.create({
    buttonLayout:{
        borderRadius: 7,
        width: 37,
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center'
    }
})