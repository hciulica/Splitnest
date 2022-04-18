import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
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

const useLogin = (emailP, passwordP) => {
  signInWithEmailAndPassword(authentication, emailP, passwordP)
  .then(re => {
          console.log("User logged in with ", emailP, passwordP);

          navigation.navigate('Camera');
  })
  .catch(re => {
    const errorCode = re.code;
    Alert.alert(re);
  })
}

export default useLogin;