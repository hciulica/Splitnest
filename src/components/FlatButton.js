import React from 'react';
import {StyleSheet, TouchableOpacity, TouchableHighlight, Text, View} from 'react-native';

export default function FlatButton({ title, onPress }) {
    return (
        <View style={{justifyContent: 'center'}}>
            <TouchableOpacity activeOpacity={.6} onPress={onPress}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{ title }</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    
    button: {
        borderRadius: 15,
        height: 53,
        width: 300,
        backgroundColor: '#3165FF',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        justifyContent: 'center',
        textAlign: 'center'
    }
})