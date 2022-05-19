import React from 'react';
import {View, Text} from 'react-native';
import FlatButton from '../components/FlatButton';
import FlipCard from 'react-native-flip-card'

const AddExpenseScreen = ({navigation}) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <FlatButton title = "Go back" onPress={() => navigation.goBack()}/>
            <FlipCard 
                // style={styles.card}
                friction={6}
                perspective={1000}
                flipHorizontal={true}
                flipVertical={false}
                flip={false}
                clickable={true}
                onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
                >

                {/* Face Side */}
                <View style={{marginTop: 43,
                            borderRadius: 20,
                            width: 200,
                            height: 241,
                            backgroundColor: 'white'}}
                >
                    <Text>The Face</Text>
                </View>

                {/* Back Side */}
                <View style={{marginTop: 43,
                            borderRadius: 20,
                            width: 200,
                            height: 241,
                            backgroundColor: 'white'}}>
                    <Text>The Back</Text>
                </View>
            </FlipCard>
        </View>
    )
}

export default AddExpenseScreen;