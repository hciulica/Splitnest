import React from "react";
import { View, Text } from "react-native";
import FlatButton from "../components/FlatButton";
import FlipCard from "react-native-flip-card";
import TouchableWithAnimation from "../components/TouchableWithAnimation";

const AddExpenseScreen = ({ navigation }) => {
   return (
      <View style={styles.container}>
         <Text>AddExpenseScreen</Text>
         <TouchableWithAnimation onPress={() => navigation.goBack()}>
            <Text>Go back</Text>
         </TouchableWithAnimation>
      </View>
   );

   const styles = StyleSheet.create({
      container: {
         flex: 1,
      },
   });
};

export default AddExpenseScreen;
