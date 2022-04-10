import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableOpacityHighlight,
  Switch,
  Image,
} from 'react-native';
import FlatButton from '../components/FlatButton';
import ImputField from '../components/InputField';
import {authentication} from '../api/firebase/firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth';
import AnimatedInput from "react-native-animated-input";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
// import SplitnestIcon from '../../assets/images/SplitLogo.svg';

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassMail, setForgotPassMail] = useState('');

  const [isEnabled, setIsEnabled] = useState(false);
  
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
   const signInUser = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(re => {
        Alert.alert('Authentication');
        navigation.navigate('Camera');
      })
      .catch(re => {
        const errorCode = re.code;
        switch(errorCode)
        {
          case 'auth/wrong-password':
             Alert.alert('Error','Wrong password');
          break;

          case 'auth/too-many-requests':
            Alert.alert('Too many attempts failed');
          break;

          case 'auth/user-disabled':
            Alert.alert('This account has been banned');
          break;

          case 'auth/invalid-email':
            Alert.alert('Error','Please insert a valid email');
          break;

          case 'auth/user-not-found':
            Alert.alert('Error', 'There is no account with the credentials entered');
          break;

          case 'auth/internal-error':
            Alert.alert('Error', 'Please insert password of your email');
          break;
        }
        console.log(re);
      });
  };

   const resetPassInputMail = () => {
    Alert.prompt(
      "Forgot password",
      "Enter your email to send you a reset email",
      [
        {
          text: "Send email",
          onPress: mail => resetPassword(mail),
          style: "default"
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }  
      ],
    );
  }

   const resetPassword = (emailReset) => {
     
     sendPasswordResetEmail(authentication, emailReset)
      .then(() => {
        Alert.alert(
          'Email for password reset sent',
          'Please check your email inbox for the reset password');
      })
      .catch(error => {
        const errorCode = error.code;
        switch(errorCode)
        {
        case 'auth/user-not-found':
        
        Alert.alert(
              'Error',
              'There is not an account created with this email',
              [{ text: "Try again", onPress: () => resetPassInputMail() },
               { text: "Cancel", onPress: () => console.log("Cancel Pressed"),
                style: "cancel" }]
        );
        
         break;
        
          case 'auth/missing-email':
        Alert.alert(
              'Error',
              'Please enter an email',
              [{ text: "Try again", onPress: () => resetPassInputMail() },
               { text: "Cancel", onPress: () => console.log("Cancel Pressed"),
                style: "cancel" }]
        );
        break;

        case 'auth/network-request-failed':
          Alert.alert(
              'Error',
              'Network error',
              [{ text: "Try again", onPress: () => resetPassInputMail() },
               { text: "Cancel", onPress: () => console.log("Cancel Pressed"),
                style: "cancel" }]
        );
        break;


        case 'auth/invalid-email':
         Alert.alert(
              'Error',
              'Please enter a valid email',
              [{ text: "Try again", onPress: () => resetPassInputMail() },
               { text: "Cancel", onPress: () => console.log("Cancel Pressed"),
                style: "cancel" }]
        );
        break;
        
      }
        console.log(error);
        //Alert.alert(errorCode);
      })
  };

  return (

    <View style={styles.container}>
      <Image style={styles.logoStyle}
        source={require('../../assets/images/SplitLogo.png')}
      />
      <View style={styles.welcomeContainer}>
        <Text style = {{fontSize: 26, fontWeight: '900'}}>Welcome back!</Text>
        <Text style = {{fontSize: 21, marginTop: 20}}>Login to your account</Text>
      </View>
      
      <View style = {styles.emailInput}>
        <InputField 
          name='email' 
          value={email} 
          onChangeText={text => setEmail(text)}
        />    
      </View> 
      
      <View>
        <InputField 
          name='password' 
          value={password}
          onChangeText={text => setPassword(text)}
        /> 
      </View>

      <View style={styles.group}>
        <View style={styles.switchStyle}>
          <Switch
            trackColor={{ false: "#E3E3E3", true: "#3165FF" }}
            thumbColor={ isEnabled ? "#FFFFFF" : "#FFFFFF" }
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <View style={styles.label}>
          <Text>Remember me</Text>
        </View>
        
        <TouchableOpacity
        style={styles.forgotpass}
        onPress={resetPassInputMail}>
          <Text style={{fontSize: 14, textDecorationLine: 'underline'}}>Forgot password</Text>
        </TouchableOpacity>

      </View>

      <FlatButton 
        title="Sign in" onPress={() => signInUser()} 
      />
      <View style={styles.groupLabel}>
        <Text style={{fontWeight: '100', fontSize: 16, marginRight: 10}}>Don't have an account?</Text>
        <TouchableOpacity
            style={styles.touchableOpac}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.touchableOpac}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoStyle: {
    width: 144,
    height: 180,
    resizeMode: 'stretch',
  },
  welcomeContainer:{
    marginBottom: 20,
    marginTop: 10
  },
  groupLabel: {
    flexDirection: 'row',
    margin: 24,
  },
  switchStyle: {
    marginRight: 8,
  },
  label:{
    marginRight: 27,
    fontSize: 14,
  },
  group:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  emailInput: {
    marginBottom: 15
  },

  container: {
    // flexDirection: 'row',
    marginTop: 52,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
   
  },

  emailField: {
    width: 300,
    height: 48,
    borderWidth: 1
  },

  textField: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 50,
  },
  touchableOpac: {
    //color: 0x12EFEF
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3165FF'
  },
  forgotpass: {
    color: 0xa6a6a6,
  },
});

export default LoginScreen;