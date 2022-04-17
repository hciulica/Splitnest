import React, {useState, useEffect} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {getStorage, uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {updateProfile, signOut} from 'firebase/auth';
import {storage} from '../api/firebase/firebase-config';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplitLogo from '../../assets/images/SplitLogo.svg';
import FlatButton from '../components/FlatButton';

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
  const [imageUriAux, setImageUriAux] = useState('');
  const [url1, setUrl1] = useState('');

  const [colorBorderPicture, setColorBorderPicture] = useState("'#3165FF'");
  let colorBorderSelected = '#3165FF';

  let counter = 0;

  useEffect (() => {
  
    const refAux = ref(storage, `/horiaciulica23@gmail.com/Profile/Profile_Image.jpg`);
    getDownloadURL(refAux)
    .then((urlAu) => {
      
      setImageUriAux(urlAu);
    })

  })


  const signOutUser = () => {
      const user = authentication.currentUser;

      if (user) {
        const email = authentication.currentUser.email;
         signOut(authentication)
          .then(() => {
  
            AsyncStorage.removeItem('emailLoggedIn');
            AsyncStorage.removeItem('passwordLoggedIn');
            navigation.navigate('Login');
          })
          .catch(re => {
            Alert.alert(re);
          });
      } else {
        Alert.alert('You are not signed in');
      }
    };

  bs = React.createRef();
  fall = new Animated.Value(1);

   const renderInner = () => (
      <Text>Swipe down to close</Text>
  );

  const renderHeader = () => {
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style = {styles.panelHandle} />
      </View>
    </View>
  }
 
  const sheetRef = React.useRef(null);

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
     
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button', response.customButton);
      } else {
      uploadImageCloud((response.assets[0].uri));
      }
    });
  };

  const selectFromGalleryWithCrop = async () => {
    
    await ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      mediaType: 'photo',
      path: 'images',
      cropperCircleOverlay: 'true',
      includeBase64: true
    }).then(image => {
      uploadImageCloud(image.path);
    })
    .catch((err) => {
      console.log('User canceled selection');
    })
  }

  const openCameraWithCrop = async () => {
    
    await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      cropperCircleOverlay: 'true',
      path: 'images',
      includeBase64: true
    }).then(image => {
      uploadImageCloud(image.path);
    });
  }


  const uploadImageCloud = async(imagePath) => {

    console.log(imagePath);
    //const storage = getStorage();
    const folderName = authentication.currentUser.email;
    const storageRef = ref(storage, `${folderName}/Profile/Profile_image.png`);
    const img = await fetch(imagePath);
    const bytes = await img.blob();
    await uploadBytes(storageRef, bytes);
    getDownloadURL(storageRef)
    .then((url) => {
        updateImage(url);
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

            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
      });
  }


  const updateImage = async(imageUrl) => {
    await updateProfile(authentication.currentUser, {
      photoURL: imageUrl
    }).then(() => {
      
      Alert.alert("Profile updated!");
      // Profile updated!
      // ...
    }).catch((error) => {
      Alert.alert(error);
      // An error occurred
      // ...
    });
    console.log(imageUrl);
    setUrl1(authentication.currentUser.photoURL);
    console.log(JSON.stringify(authentication.currentUser, null, 3));

  }

  const changeImageOrGallery = () => {
    Alert.alert(
      "Choose modality",
      "Choose your modality for choosing to pick image",
      [
        {
          text: "Pick image",
          onPress: () => selectFromGalleryWithCrop(),
          style: "default"
        },
        {
          text: "Take a photo",
          onPress: () => openCameraWithCrop(),
          style: "default"
        },  
        {
          text: "Cancel",
          style: "cancel"
        },
      ],
    );
  }

  return (
    <View style={{flex:1, alignItems:'center', marginTop: 80}}>
      <Text style={{ fontSize: 30, marginBottom: 30, fontWeight: '600'}}>{authentication.currentUser.displayName}</Text>

      <TouchableOpacity onPress={changeImageOrGallery} >
      
        <Image
          source={{ uri: authentication.currentUser.photoURL }}
          style = {styles.imageStyle}

        />
      </TouchableOpacity>  
      <FlatButton title="Signout" onPress={signOutUser}></FlatButton>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle : {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: '#3165FF',
    marginBottom: 430,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },

  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marinBottom: 10,
  }
});

export default CameraScreen;
