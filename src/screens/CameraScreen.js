import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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

const CameraScreen = () => {
  const [imageUri, setImageUri] = useState('');

  const launchCamera1 = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button', response.customButton);
      } else {
        const source = {uri: 'data:image/jpeg;base64,' + response.base64};
        setImageUri(source);
      }
    });
  };

  return (
    <View>
      <Text>Camera</Text>
      <Button title="Launch camera" onPress={launchCamera1} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CameraScreen;
