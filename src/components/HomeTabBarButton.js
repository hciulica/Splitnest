import React, {useRef} from 'react';
import HomeIconFocused from '../../assets/icons/navbar/home-focused.svg';
import HomeIconUnfocused from '../../assets/icons/navbar/home-unfocused.svg';

import { 
    View,
    TouchableWithoutFeedback,
    Animated,
    Text,
 } from "react-native";

const HomeTabBarButton = ({focused, fill, style, onPress}) => {
    const animatePress = useRef(new Animated.Value(1)).current;
    
    const animateIn = () => {
        Animated.timing(animatePress,{
            toValue:0.95,
            duration: 50,
            useNativeDriver: true
        }).start()
    }

    const animateOut = () => {
        Animated.timing(animatePress,{
            toValue:1,
            duration: 50,
            useNativeDriver: true
        }).start()
    }


    if(focused)
    {
        return (
             <View style={{marginTop : 27, marginLeft: 20}}>
            <TouchableWithoutFeedback
                    onPressIn =  { () => animateIn()  }  
                    onPressOut = { () => animateOut() }>                  
                <Animated.View style={{ 
                    transform: [
                        { scale:animatePress }
                    ], alignItems: 'center'}}>   
                        <HomeIconFocused fill={fill} /> 
                        <Text style={{fontSize: 8, marginTop: 8, fontWeight: '900', color: '#3165FF'}}>Home</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            </View>
        );
    }
    else 
    {
        return (
            <View style={{marginTop : 27, marginLeft: 20}}>
            <TouchableWithoutFeedback
                    onPressIn =  { () => animateIn()  }  
                    onPressOut = { () => animateOut() }
                    onPress={onPress}
                    >                  
                        <Animated.View style={{ 
                            transform: [
                            { scale:animatePress }
                            ], alignItems: 'center'}}>   
                        <HomeIconUnfocused fill={fill} /> 
                        <Text style={{fontSize: 8, marginTop: 8}}>Home</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            </View>

        )
    }
}

export default HomeTabBarButton;