import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Button} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default InputField = (props) => {
    return (
        <View>
{/* style={styles.container}> */}
           {props.name === 'email' ?
           <View style={styles.containerBox}>
                <Text style={styles.textPlaceHolder}>Email</Text>
                <View style={styles.fieldBox}>
                        <Feather style={styles.icon} name = 'mail' size = {19} />
                        <TextInput 
                            placeholder="Enter your email address" 
                            value={props.value}
                            style={styles.inputField} 
                            autoCapitalize='none' 
                            autoCorrect={false}
                            onChangeText={(text) => props.onChangeText(text)}>
                        </TextInput>
                </View>
            </View>
            : null}
            
            {props.name === 'password' ?
                 <View style={styles.containerBox}>
                <Text style={styles.textPlaceHolder}>Password</Text>
                <View style={styles.fieldBox}>
                        <Feather style={styles.icon} name = 'lock' size = {19} />
                        <TextInput 
                            placeholder="Enter your password" 
                            value={props.value}
                            style={styles.inputField} 
                            autoCapitalize='none' 
                            autoCorrect={false}
                            onChangeText={(text) => props.onChangeText(text)}
                            secureTextEntry>
                        </TextInput>
                </View>
            </View>
            : null}
           
        </View>
    );
    
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        // margin: 10,
    },
    containerBox: {
        paddingBottom: 15,
    },
    icon: {
        flex:1,
        padding: 8,
        margin: 5,
        // resizeMode: 'stretch',
        // alignItems: 'flex-end',
    },

    textPlaceHolder:{
        
        color: 'grey',
        marginBottom: 4,
        marginLeft: 4,
        fontSize: 13,

        // justifyContent: 'flex-start',
    },
    fieldBox:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: '#E4E3E4',
        borderColor: '#ACACAC',
        borderRadius: 10,
        width: 300,
        height: 48,
        
    },
    inputField: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 48,
        fontSize: 13
    },

    
})