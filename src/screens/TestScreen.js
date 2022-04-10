import React from 'react';
import {View,StyleSheet} from 'react-native';
import FlatButton from '../components/FlatButton';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import { Fumi } from 'react-native-textinput-effects';
import { Kohana } from 'react-native-textinput-effects';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import AnimatedInput from "react-native-animated-input";

const TestScreen = () => {
    return (
        <View>
        <Fumi
            label={'Email'}
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'#3165FF'}
            iconSize={20}
            iconWidth={40}
            inputPadding={16}
        />

  <Fumi
    label={'Passsword'}
    iconClass={FontAwesomeIcon}
    iconName={'lock'}
    iconColor={'#3165FF'}
    iconSize={20}
    iconWidth={40}
    inputPadding={16}
  />

    <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>
      <AnimatedInput
        placeholder="Email"
        //valid={}
        errorText="Error"
        //onChangeText={handleChange}
        //value={email}
        styleLabel={{ fontWeight: "600" }}
        styleBodyContent={{ borderBottomWidth: 1.5 }}
      />
    </View>
        </View>
    )
    
    const styles = StyleSheet.create({
        viewStyle: {
            marginTop:50,
        }
    })

}

export default TestScreen;