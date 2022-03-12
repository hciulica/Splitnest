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

const LoginScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoggedIn, setEmailLoggedIn] = useState(false);
  const [confirmationResult1, setConfirmationResult1] = useState('');
  const [code, setCode] = useState('');
  let provider = '';

  const signInUser = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(re => {
        Alert.alert('Authentication');
      })
      .catch(re => {
        const errorCode = re.code;
        if (errorCode === 'auth/wrong-password') {
          Alert.alert('Wrong password!');
        }

        if (errorCode === 'auth/too-many-requests') {
          Alert.alert('Too many requests!');
        }

        console.log(re);
      });
  };

  const getNameConnected = () => {
    const user = authentication.currentUser;
    if (user) {
      Alert.alert(user.displayName);
    } else {
      Alert.alert('No one is connected');
    }
  };

  const createAccount = () => {
    createUserWithEmailAndPassword(authentication, email, password)
      .then(() => {
        Alert.alert(
          'Created user with email: ' + email + ' and password:' + password,
        );
        // updateProf();
        updateProfile(authentication.currentUser, {
          displayName: username,
        })
          .then(() => {
            console.log('Updated phoneNumber');
          })
          .catch(error => {
            Alert.alert(error);
          });
      })
      .catch(re => {
        const errorCode = re.code;
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Email is already in use');
        }
      });
  };

  const stateChange = () => {
    //Functie ciclica care se apeleaza automat cand se schimba un state
    onAuthStateChanged(authentication, user => {
      if (user) {
        setEmailLoggedIn(true);
      } else {
        setEmailLoggedIn(false);
      }
    });
  };

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
      <TouchableOpacity onPress={resetPassword}>
        <Text>Forgot password</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textField}
        placeholder="CodeSMS"
        value={code}
        onChangeText={text => setCode(text)}
      />
      <Button title="Get user connected" onPress={getNameConnected} />
      <Button title="Sign up" onPress={createAccount} />
      <Button title="Sign in" onPress={signInUser} />
      <Button title="Sign out" onPress={signOutUser} />
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

export default LoginScreen;
