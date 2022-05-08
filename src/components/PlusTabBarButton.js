import React, {useState, useEffect, useRef} from 'react';
import { View , Image, StyleSheet, Text, TouchableWithoutFeedback, Animated} from 'react-native';
import ButtonIcon from '../../assets/icons/navbar/button.svg';
import TouchableWithAnimation from '../components/TouchableWithAnimation';

const PlusTabBarButton = ({children, onPress, navigation}) => {

    return (
            <TouchableWithAnimation duration = {100} pressAnimation = {0.90} style={{marginTop: 12, marginRight: 25, marginLeft: 15}}>
                <ButtonIcon fill='#4674FF'/>
            </TouchableWithAnimation>
           
        );
    
};

export default PlusTabBarButton;