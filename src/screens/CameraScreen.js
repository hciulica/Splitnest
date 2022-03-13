import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getStorage, uploadBytes, ref, getDownloadURL} from 'firebase/storage';

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

import {authentication} from '../api/firebase/firebase-config';

const CameraScreen = () => {

  const [imageUri, setImageUri] = useState('../../assets/images/SplitLogo.svg');
  const [url1, setUrl1] = useState('../../assets/images/SplitLogo.svg');

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


  const funct = async() => {

    console.log(imageUri);
    const storage = getStorage();
    const storageRef = ref(storage, 'Ceva/image.jpg');
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

  return (
    <View>
      <Button title="Select from gallery" onPress={selectFromGallery} />
      <Button title="Open camera" onPress={openCamera} />
      <Button title="Upload" onPress={funct} />
      <Button title="Select image crop" onPress={selectGalleryImageCrop} />
      <View style = {styles.imageStyle}>
        <Image
          source={{ uri: url1 }}
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
