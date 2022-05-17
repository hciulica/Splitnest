import React from 'react';
import {View, Text} from 'react-native';
import FlatButton from '../components/FlatButton';

const AddExpenseScreen = ({navigation}) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <FlatButton title = "Go back" onPress={() => navigation.jumpTo('Home')}/>
        </View>
    )
}

export default AddExpenseScreen;