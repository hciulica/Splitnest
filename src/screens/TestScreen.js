import React from 'react';
import {View,StyleSheet,Text, Button, TouchableOpacity} from 'react-native';
import FlatButton from '../components/FlatButton';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import { Fumi } from 'react-native-textinput-effects';
import { Kohana } from 'react-native-textinput-effects';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import AnimatedInput from "react-native-animated-input";
import { AnimatedBackgroundColorView } from 'react-native-animated-background-color-view';

const TestScreen = ({navigation}) => {
    const [colored, setColored] = React.useState('#99affd')
    const [initialColored, setInitialColored] = React.useState(null)

    const changeColor = () => {
      if(initialColored === '#f21234'){

        setColored('#dfe123')
      }
      else if(initialColored === '#dfe123')
      {
        setColored('#f21234')
      }
    }

    const changeTheColor = (color) => {
      // if(color === '#f21234'){
      //   //setInitialColored('#dfe123')
      //   setColored(color);
      // }
      // if(color === '#dfe123'){
      //   //setInitialColored('#f21234')
      //   setColored(color);
      // }
      setColored(color);
    }

    return (
      <AnimatedBackgroundColorView
        color={colored}
        initialColor={initialColored}
        style={{ flex: 1 }}
      >
      <View style={{marginTop: 90}}>
        <Text>Hello, world!</Text>
        <TouchableOpacity onPress={() => changeTheColor('#f21234')}>
          <Text>Press Red</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeTheColor('#dfe123')}>
          <Text>Press Yellow</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeColor()}>
          <Text>Press</Text>
        </TouchableOpacity>

        
        
      </View>
      </AnimatedBackgroundColorView>
      
    )
    
    const styles = StyleSheet.create({
        viewStyle: {
            marginTop:50,
        }
    })

}

export default TestScreen;