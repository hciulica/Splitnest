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
import {authentication} from '../firebase//firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createAccountHook = (emailUser, passwordUser) => {
    createUserWithEmailAndPassword(authentication, emailUser, passwordUser)
      .then(() => {
        Alert.alert(
          'Created user with email: ' + email + ' and password:' + password,
        );
        setIsSignedIn(true);
      })
      .catch(re => {
        const errorCode = re.code;
        const errorMessage = re.message;
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Email is already in use');
        }
        console.log(re);
      });
  };

  return [createAccountHook];
};
