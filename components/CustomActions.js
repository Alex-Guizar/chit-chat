// Packages
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

// Expo
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Firebase
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {
  /**
   * Ask permission for access to user's media library.
   * If granted, await selected image and set it to state.
   */
  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images'
      }).catch(err => console.error(err));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({
          image: imageUrl
        });
      }
    }
  }

  /**
   * Ask permission for access to user's camera and media library.
   * If granted, await picture taken or selected and set it to state.
   */
  takePhoto = async () => {
    const camPermission = await ImagePicker.requestCameraPermissionsAsync();
    const imgPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (camPermission.status === 'granted' && imgPermission.status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images'
      }).catch(err => console.error(err));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({
          image: imageUrl
        });
      }
    }
  }

  /**
   * 
   * @param {*} uri 
   * @returns image url form firebase storage
   * Uploads image to firebase storage
   */
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      
      xhr.onerror = function(e) {
        console.error(e);
        reject(new TypeError('Network request failed'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);

    blob.close();

    return snapshot.ref.getDownloadURL();
  }

  /**
   * Requests permission for foreground location.
   * If granted, get current position and send coords in message.
   */
  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        const latitude = result.coords.latitude;
        const longitude = result.coords.longitude;
        this.props.onSend({
          location: {
            latitude,
            longitude
          }
        });
      }
    }
  }

  /**
   * Direct action press to appropriate function handlers.
   */
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.pickImage();
            return;
          case 1:
            this.takePhoto();
            return;
          case 2:
            this.getLocation();
          default:
        }
      }
    );
  }

  render() {
    return (
      <TouchableOpacity 
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Let's you choose to send an image or your geolocation."
        accessibilityRole="button"
        style={[styles.container]} 
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};