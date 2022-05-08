import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Button} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default InputField = ({name, value, onChangeText}) => {
    const [handleFocusState, setHandleFocusState] = useState(false);
    const customStyle = handleFocusState ? styles.fieldBoxFocus :styles.fieldBox;
    const customIcon = handleFocusState ? styles.iconFocus: styles.icon;
    const [showPassword, setShowPassword] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye-off');

    const handlePasswordVisibility = () => {
        if (rightIcon === 'eye') {
            setRightIcon('eye-off');
            setShowPassword(!showPassword);
        } else if (rightIcon === 'eye-off') {
            setRightIcon('eye');
            setShowPassword(!showPassword);
        }
    }

    return (
        <>
           {name === 'email' ?
           <View>
                <Text style={styles.textPlaceHolder}>Email</Text>
                <View style={customStyle}>
                        <Feather style={customIcon} name = 'mail' size = {19} />
                        <TextInput 
                            placeholder="Enter your email address" 
                            value={value}
                            style={styles.inputField} 
                            onFocus={() => setHandleFocusState(true)}
                            onBlur={() => setHandleFocusState(false)}
                            autoCapitalize='none'
                            keyboardType='email-address' 
                            autoCorrect={false}
                            onChangeText={(text) => onChangeText(text)}>
                        </TextInput>
                        
                </View>
            </View>
            : null}
            
            {name === 'password' ?
            <View>
                <Text style={styles.textPlaceHolder}>Password</Text>
                <View style={customStyle}>
                        <Feather style={styles.iconPass} name = 'lock' size = {19} />
                        <TextInput 
                            placeholder="Enter your password" 
                            value={value}
                            style={styles.inputField}
                            onFocus={() => setHandleFocusState(true)}
                            onBlur={() => setHandleFocusState(false)}
                            autoCapitalize='none' 
                            autoCorrect={false}
                            onChangeText={(text) => onChangeText(text)}
                            secureTextEntry={showPassword}>
                        </TextInput>
                        
                        <TouchableOpacity onPress={handlePasswordVisibility} style={styles.iconFocusShow}>
                             <Feather name = {rightIcon} size = {20} />
                        </TouchableOpacity>
                </View>
            </View>
            : null}
           
           {name === 'username' ?
            <View>
                <Text style={styles.textPlaceHolder}>Username</Text>
                <View style={customStyle}>
                        <Feather style={styles.iconPass} name = 'user' size = {19} />
                        <TextInput 
                            placeholder="Enter your profile name" 
                            value={value}
                            style={styles.inputField}
                            onFocus={() => setHandleFocusState(true)}
                            onBlur={() => setHandleFocusState(false)}
                            autoCapitalize='none' 
                            keyboardType='email-address' 
                            autoCorrect={false}
                            maxLength={20}
                            onChangeText={(text) => onChangeText(text)}>
                        </TextInput>
                </View>
            </View>
            : null}


            {name === 'phone' ?
            <View>
                <Text style={styles.textPlaceHolder}>Phone</Text>
                <View style={customStyle}>
                        <Feather style={styles.iconPass} name = 'phone' size = {19} />
                        <TextInput 
                            placeholder="Enter your phone number" 
                            value={value}
                            style={styles.inputField}
                            onFocus={() => setHandleFocusState(true)}
                            onBlur={() => setHandleFocusState(false)}
                            autoCapitalize='none' 
                            autoCorrect={false}
                            keyboardType='number-pad'
                            maxLength={10}
                            onChangeText={(text) => onChangeText(text)}>
                        </TextInput>
                </View>
            </View>
            : null}

        </>
    );
    
}

const styles = StyleSheet.create({

    

    container: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        // margin: 10,
    },
    
    icon: {
        // flex:3,
        padding: 8,
        margin: 5,
        //backgroundColor: 'blue',
       
        // resizeMode: 'stretch',
        // alignItems: 'flex-end',
    },
    iconFocus: {
        // flex:1,
        padding: 8,
        margin: 5,
        //backgroundColor: 'blue',
     
        // resizeMode: 'stretch',
        // alignItems: 'flex-end',
        
    },

    iconFocusShow: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // marginRight: 40,
        // width: 50,
        // height: 40,
        // borderRadius: 10,

        //backgroundColor: 'yellow',
        padding: 5,
         
    },
    iconPass: {
        //  flex:1,
         padding: 8,
         margin: 5,
        //backgroundColor: 'blue',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPlaceHolder:{
        
        // color: 'grey',
        marginBottom: 4,
        marginLeft: 4,
        fontSize: 13,

        // justifyContent: 'flex-start',
    },
    fieldBox:{
         flexDirection: 'row',
        // justifyContent: 'center',
         alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(49,101,255,0.03)',
        //backgroundColor: 'green',
        borderColor: 'transparent',
        
        borderRadius: 10,
        width: 300,
        height: 48,
    },
    fieldBoxFocus:{
        flexDirection: 'row',
        // justifyContent: 'center',
         alignItems: 'center',
        borderWidth: 2,
        //backgroundColor: 'green',
        backgroundColor: 'rgba(49,101,255,0.00)',
        backgroundOpacity: 0.2,
        borderColor: '#3165FF',
        borderRadius: 10,
        width: 300,
        height: 48,
        
    },
    
    inputField: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 210,
        height: 48,
        fontSize: 13,
        borderRadius: 10,

    },

    
})