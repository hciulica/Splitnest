import React from 'react';
import {StyleSheet, TouchableOpacity, TouchableHighlight, Text, View} from 'react-native';

export default function OnboardButton({onPress, title, color}) {
    const styleButton = color === 'white' ? styles.buttonWhite : styles.buttonSimple; 
    return (
        <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={onPress} activeOpacity={.6}>
                <View style={styleButton}>
                    <Text style={styles.buttonText}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
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