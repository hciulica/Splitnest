import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Alert,
  AlertType,
  TouchableOpacity,
  Image
} from 'react-native';
import { authentication, db } from '../api/firebase/firebase-config';
import { doc, setDoc } from "firebase/firestore";
import FlatButton from '../components/FlatButton';
import LinearGradient from 'react-native-linear-gradient';


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
  sendEmailVerification
} from 'firebase/auth';


const RegisterScreen = ({ navigation }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoggedIn, setEmailLoggedIn] = useState(false);
  const [confirmationResult1, setConfirmationResult1] = useState('');
  const [code, setCode] = useState('');
  let provider = '';


  const numberVerification = () => {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, authentication);

  }

  const consoleAuthentication = () => {
    console.log(JSON.stringify(authentication.currentUser, null, 3));
  }

  const getNameConnected = () => {
    const user = authentication.currentUser;
    if (user) {
      Alert.alert(user.displayName);
      consoleAuthentication();
    } else {
      Alert.alert('No one is connected');
    }
  };

  const verificationEmail = () => {
    sendEmailVerification(authentication.currentUser)
    .then(() => {
      Alert.alert("An email verification has been sent");
  });
  }

  const addToFirestoreForAuthentication = async() => {
    try{
        await setDoc(doc(db, "User profiles", authentication.currentUser.uid), {
          phone: phone,
          email: authentication.currentUser.email,
          username: username,
        });
    } catch(err)
    {
      console.log(err);
    }
  } 

  const createAccount = async() => {
    if(!username)
        Alert.alert(
              'Error',
              'Please enter a username',);
    else
    if(!phone)
      Alert.alert(
              'Error',
              'Please enter a phone number',
      ); 
    else
    createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        updateProfile(authentication.currentUser, {
          displayName: username,
        })
          .then(() => {
            console.log('Created user with email: ' + email + ' with name' + username);        
            addToFirestoreForAuthentication();
            consoleAuthentication();
            verificationEmail();
            navigation.navigate('Camera');
          })
          .catch(error => {
            const errorCode = re.code;
            Alert.alert(error);
          });
          
      })
      .catch(re => {
        const errorCode = re.code;
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Error', 'Email is already in use');
        }

        if (errorCode === 'auth/weak-password')
        {
          Alert.alert('Error', 'Password should be at least 6 characters');
        }

        if(errorCode ==='auth/internal-error')
        {
          Alert.alert('Error', 'Please insert a password');
        }

        if(errorCode ==='auth/invalid-email')
        {
          Alert.alert('Error', 'Please insert a valid email');
        }

        console.log(re);
      });
    
    
  };

  // const stateChange = () => {
  //   //Functie ciclica care se apeleaza automat cand se schimba un state
  //   onAuthStateChanged(authentication, user => {
  //     if (user) {
  //       setEmailLoggedIn(true);
  //     } else {
  //       setEmailLoggedIn(false);
  //     }
  //   });
  // };

  

 

  const resetPassword = () => {
    resetButt();
    sendPasswordResetEmail(authentication, email)
      .then(() => {
        // Password reset email sent!
        // ..
        Alert.alert('Password reset email success');
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found') {
          Alert.alert('There is not an account created with this email');
        }
        console.log(error);
        //Alert.alert(errorCode);
      });
  };

  return (
    <View style={styles.container}>
    <View style={styles.imageContainer}>
      <Image style={styles.logoStyle}
        source={require('../../assets/images/SplitLogo.png')}
      />
    </View>
        <Text style = {{fontSize: 26, marginTop: 22, fontWeight: '900'}}>Welcome to Splitnest!</Text>
        <Text style = {{fontSize: 21, marginTop: 20, marginBottom: 22}}>Create an account</Text>
      <View style={styles.fieldsBoxStyle}>
        <InputField
          name='username'
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </View>

      <View style={styles.fieldsBoxStyle}>
        <InputField
          name='phone'
          value={phone}
          onChangeText={text => setPhone(text)}
        />
      </View>

      <View style={styles.fieldsBoxStyle}>
        <InputField 
          name='email' 
          value={email} 
          onChangeText={text => setEmail(text)}
        />
      </View>

      <View style={styles.fieldsBoxStyle}>
        <InputField 
          name='password' 
          value={password} 
          onChangeText={text => setPassword(text)}
        /> 
      </View>

      <View style={{marginTop: 30}}>
        <FlatButton title="Sign up" onPress={createAccount}></FlatButton>
      </View>

      <View style={styles.groupBottom}>
        <Text style={{fontWeight: '100', fontSize: 16, marginRight: 10}}>Do you have any account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.touchableOpacityStyle}>Sign in</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer:{
    borderColor: '#5A429A',
    borderWidth: 3,
    paddingTop: 19,
    paddingLeft: 16, 
    paddingBottom: 18,
    paddingRight: 13,
    borderRadius: 75,
  },
  logoStyle: {
    width: 74,
    height: 66,
  
    // resizeMode: 'stretch',
  },
  touchableOpacityStyle:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3165FF',
    justifyContent: 'center'
  },
  groupBottom: {
    flexDirection: 'row',
    marginTop: 24,
  },
  fieldsBoxStyle:{
    marginBottom: 16
  },
  container:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  textField: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonStyle:{
    weight: 180,
    height: 53,
    backgroundColor: 0x0feeee
  },
  forgotpass: {
    color: 0xa6a6a6,
  },
});

export default RegisterScreen;
