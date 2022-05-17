import React, {useRef} from 'react';
import AboutIcon from '../../assets/icons/accscreen/aboutIcon.svg';
import SettingsIcon from '../../assets/icons/accscreen/settingsIcon.svg';
import PaymentsIcon from '../../assets/icons/accscreen/paymentsIcon.svg';
import LogoutIcon from '../../assets/icons/accscreen/logoutIcon.svg';

import TouchableWithAnimation from '../components/TouchableWithAnimation';

import { 
    View,
    TouchableWithoutFeedback,
    Animated,
    Text,
    StyleSheet
 } from "react-native";

const ExploreCard = ({focused, fill, style, onPress, name}) => {
    // const iconSelected = (name === 'about') ? <AboutIcon/>  
        return (
            <TouchableWithAnimation style={styles.card} onPress={onPress}>
                { 
                    (name === 'about') ? 
                      <AboutIcon/> : 
                    (name === 'settings') ? 
                      <SettingsIcon/> : 
                    (name === 'payments') ? 
                      <PaymentsIcon/> :
                    (name === 'logout') ?  
                      <LogoutIcon/> : null
                }
                
                <Text style={[styles.labelCard,
                    {
                    // color: (name === 'logout') ? 'red' : null
                    },
                    // {fontWeight: (name === 'logout') ? '700' : '500'}
                    ]}
                    >
                { 
                    (name === 'about') ? 
                        'About' : 
                    (name === 'settings') ? 
                        'Settings' : 
                    (name === 'payments') ? 
                        'Payments' :
                    (name === 'logout') ?  
                        'Logout' : null
                }
                </Text>

            </TouchableWithAnimation>
    );
}

const styles = StyleSheet.create({
    card:{
        width: 90,
        height: 90,
        marginHorizontal: 10,
        marginTop: 25,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    labelCard:{
        fontWeight: '500',
        fontSize: 12,
        marginTop: 13
    }
})

export default ExploreCard;