import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {getStorage, uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {updateProfile} from 'firebase/auth';

import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';

import {authentication, db} from '../api/firebase/firebase-config';

const CameraScreen = ({ navigation }) => {

  const [imageUri, setImageUri] = useState('');
  const [url1, setUrl1] = useState('');

  const selectGalleryImageCrop = async () =>{
    ImagePicker.openPicker({
  width: 300,
  height: 400,
  cropping: true
}).then(image => {
  console.log(image);
});
  }

  const openCamera = async () => {
   launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button', response.customButton);
      } else {
        //const source = {uri: 'data:image/jpeg;base64,' + response.base64};
       // console.log(imageUri);
      setImageUri(response.assets[0].uri);
      }
    })
  }

  const selectFromGallery = async () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      //console.log('Response = ', response.assets[0].uri);
      
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button', response.customButton);
      } else {
        //const source = {uri: 'data:image/jpeg;base64,' + response.base64};
       // console.log(imageUri);
      setImageUri(response.assets[0].uri);
      }
    });
  };

  const selectFromGalleryWithCrop = async () => {
    
    await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      path: 'images',
      includeBase64: true
    }).then(image => {
      // console.log(image.path);
      setImageUri(image.path);
    });
  }



  const funct = async() => {

    console.log(imageUri);
    const storage = getStorage();
    const folderName = authentication.currentUser.email;

    const storageRef = ref(storage, `${folderName}/profileImage.jpg`);
    const img = await fetch(imageUri);
    const bytes = await img.blob();
    await uploadBytes(storageRef, bytes);
    getDownloadURL(storageRef)
    .then((url) => {
        setUrl1(url);
    })
    .catch((error) => {
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
      });
  }

  const updateImage = async() => {
    await updateProfile(authentication.currentUser, {
    displayName: "Horica", photoURL: url1
    }).then(() => {
      
      Alert.alert("Profile updated!");
      // Profile updated!
      // ...
    }).catch((error) => {
      Alert.alert(error);
      // An error occurred
      // ...
    });
    console.log(url1);
    setUrl1(authentication.currentUser.photoURL);
    // console.log(authentication.currentUser);
  }

  const getObject = () => {
    console.log(authentication.currentUser);
  }

  return (
    <View>
      <Button title="Select from gallery" onPress={selectFromGallery} />
      <Button title="Select from gallery with crop" onPress={selectFromGalleryWithCrop}/>
      <Button title="Open camera" onPress={openCamera} />
      <Button title="Upload" onPress={funct} />
      <Button title="Select image crop" onPress={selectGalleryImageCrop} />
      <Button title="Update profile image" onPress={updateImage} />
      <Button title="User objects" onPress={getObject} />
      <View style = {styles.imageStyle}>
        <Image
          // source={{ uri: url1 }}
          source={{ uri: authentication.currentUser.photoURL }}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle : {
    marginLeft: 80
  },
});

export default CameraScreen;
