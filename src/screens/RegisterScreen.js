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
} from 'react-native';
import { authentication, db } from '../api/firebase/firebase-config';
import { doc, setDoc } from "firebase/firestore";

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

  // const signInUser = () => {
  //   signInWithEmailAndPassword(authentication, email, password)
  //     .then(re => {
  //       Alert.alert('Authentication');
  //     })
  //     .catch(re => {
  //       const errorCode = re.code;
  //       if (errorCode === 'auth/wrong-password') {
  //         Alert.alert('Wrong password!');
  //       }

  //       if (errorCode === 'auth/too-many-requests') {
  //         Alert.alert('Too many requests!');
  //       }

  //       console.log(re);
  //     });
  // };

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

  const signOutUser = () => {
    const user = authentication.currentUser;

    if (user) {
      const email = authentication.currentUser.email;
      console.log(user);
      signOut(authentication)
        .then(() => {
          Alert.alert('User with email ' + email + ' has been signout');
        })
        .catch(re => {
          Alert.alert(re);
        });
    } else {
      Alert.alert('You are not signed in');
    }
  };

 

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
    <View>
      <TextInput
        style={styles.textField}
        placeholder="Username"
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.textField}
        placeholder="Phone"
        value={phone}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={text => setPhone(text)}
      />
      <TextInput
        style={styles.textField}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.textField}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      {/* <TouchableOpacity onPress={resetPassword}>
        <Text>Forgot password</Text>
      </TouchableOpacity> */}
      <Button title="Sign up" onPress={createAccount} />
      {/* <Button title="Send an email confirmation" onPress={consoleAuthentication} /> */}
      {/* <Button title="Sign in" onPress={signInUser} /> */}
      {/* <Button title="Sign out" onPress={signOutUser} /> */}
      {/* <Button title="GOTO Camera Screen" onPress={() => navigation.navigate('Camera')} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  textField: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  forgotpass: {
    color: 0xa6a6a6,
  },
});

export default RegisterScreen;
