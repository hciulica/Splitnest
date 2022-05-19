import React, {useState, useRef} from 'react';
import {StyleSheet, TouchableOpacity,TouchableWithoutFeedback, TouchableHighlight, Text, View, Animated} from 'react-native';
import TouchableWithAnimation from '../components/TouchableWithAnimation';

export default function FlatButton({ title, onPress, disabled, style, height, width, radius, fontSize, duration, pressAnimation }) {
    
    const colorDisabled = ( disabled === true ) ? 'rgba(49,101,255,0.5)' : 'rgba(49,101,255,0.9)';
    const heightButton = height ? height : 53;
    const widthButton = width ? width : 300;
    const radiusButton = radius ? radius : 15;
    const fontSizeText = fontSize ? fontSize : 17;

    return (
        <TouchableWithAnimation style={[style, styles.buttonLayout, {backgroundColor:colorDisabled, height: heightButton, width: widthButton, borderRadius: radiusButton }]} 
            onPress={onPress} disabled={disabled} duration = {duration} pressAnimation = {pressAnimation} 
            >
                <Text style={[styles.buttonText, {fontSize:fontSizeText}]}>{ title }</Text>
        </TouchableWithAnimation>
    )
}

const styles = StyleSheet.create({
    buttonLayout:{
        borderRadius: 15,
        justifyContent: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        justifyContent: 'center',
        textAlign: 'center'
    }
})