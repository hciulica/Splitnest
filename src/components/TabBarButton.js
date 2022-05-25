import React, {useRef} from 'react';
import HomeIconFocused from '../../assets/icons/navbar/home-focused.svg';
import HomeIconUnfocused from '../../assets/icons/navbar/home-unfocused.svg';

import TouchableWithAnimation from '../components/TouchableWithAnimation';

import { 
    View,
    TouchableWithoutFeedback,
    Animated,
    Text,
 } from "react-native";

const TabBarButton = ({focused, fill, style, onPress, children}) => {
        return (
            <TouchableWithAnimation onPress={onPress}
             style={{marginHorizontal:32.5, marginTop: 30}}>                  
                {children}
            </TouchableWithAnimation>
        );
}

export default TabBarButton;