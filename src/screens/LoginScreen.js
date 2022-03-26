import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
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

// import SplitnestIcon from '../../assets/images/SplitLogo.svg';

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassMail, setForgotPassMail] = useState('');

  
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
          // onPress: mail => setForgotPassMail(mail)
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
      <InputField 
        name='email' 
        value={email} 
        onChangeText={text => setEmail(text)}
      />     
      <InputField 
        name='password' 
        value={password}
        onChangeText={text => setPassword(text)}
      /> 
      <TouchableOpacity
      style={styles.forgotpass}
       onPress={resetPassInputMail}>
        <Text>Forgot password</Text>
      </TouchableOpacity>

      <FlatButton 
        title="Sign in" onPress={() => signInUser()} 

      />
      <Text style={{fontWeight: '100'}}>Don't have an account?</Text>

      <TouchableOpacity
          style={styles.touchableOpac}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.touchableOpac}>Sign up</Text>
      </TouchableOpacity>
    
      {/* <SplitnestIcon width={300} height={300}></SplitnestIcon> */}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
    color: 0x12EFEF
  },
  forgotpass: {
    color: 0xa6a6a6,
  },
});

export default LoginScreen;