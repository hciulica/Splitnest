import React, {useState, useRef} from 'react';
import {StyleSheet, TouchableOpacity,TouchableWithoutFeedback, TouchableHighlight, Text, View, Animated} from 'react-native';
import TouchableWithAnimation from '../components/TouchableWithAnimation';

export default function FlatButton({ title, onPress, disabled }) {
    
    const colorDisabled = ( disabled === true ) ? 'rgba(49,101,255,0.5)' : 'rgb(49,101,255)';

    return (
        <TouchableWithAnimation style={[styles.buttonLayout,{backgroundColor:colorDisabled}]} duration = {50} pressAnimation = {0.95} onPress={onPress} disabled={disabled}>
                <Text style={styles.buttonText}>{ title }</Text>
         </TouchableWithAnimation>
    )
}

const styles = StyleSheet.create({
    buttonLayout:{
        borderRadius: 15,
        height: 53, 
        width: 300, 
        justifyContent: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        justifyContent: 'center',
        textAlign: 'center'
    }
})