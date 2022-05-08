import React, {useRef} from 'react';
import { View, Image, Text, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';

const TouchableWithAnimation = ({children, duration, pressAnimation, onPress, disabled, style }) => {

    const animatePress = useRef(new Animated.Value(1)).current;

        const animateIn = () => {
            Animated.timing(animatePress,{
                toValue: pressAnimation,
                duration: duration,
                useNativeDriver: true
            }).start()
        }

        const animateOut = () => {
            Animated.timing(animatePress,{
                toValue:1,
                duration: duration,
                useNativeDriver: true
            }).start()
        }
    
    return (
            <TouchableWithoutFeedback 
                
                onPressIn={() => animateIn()}
                onPressOut={() => animateOut()}
                onPress={onPress}
                disabled={disabled}
                >
                <Animated.View style={[{
                    transform: [
                        {
                            scale:animatePress
                        }
                    ]},style]}
                > 
                    {children}
                </Animated.View>
            </TouchableWithoutFeedback>
    );
}

export default TouchableWithAnimation;