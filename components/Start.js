// Packages
import React from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Image, ImageBackground } from 'react-native';

// Import input icon SVG
import InputIcon from './img/icon.svg';

// Background Image
const image = require('./img/Background-Image.png');

/**
 * User input component that gets rendered when the user
 * starts the app. User enters a name and selects a background color.
 */
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      selectedColor: null
    };
  }

  setSelectedColor = (selectedColor) => {
    this.setState({
      selectedColor
    });
  }

  render() {
    return (
      <ImageBackground source={image} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <Text style={styles.title}>Chit Chat</Text>

          <View style={styles.userInfoContainer}>
            {/* Input box style with input icon */}
            <View style={styles.inputBox}>
              <View style={styles.inputIconWrap}><InputIcon width={16} height={16} /></View>

              <TextInput 
                style={styles.textInput} 
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                placeholder="Enter Name"
              />
            </View>

            {/* Background color selection */}
            <View style={styles.colorWrap}>
              <Text style={styles.colorText}>Choose Background Color:</Text>

              <View style={styles.colorOptions}>
                <Pressable 
                  style={this.state.selectedColor === '#090C08' ? 
                    [styles.colorOptionWrap, styles.colorActive] : 
                    styles.colorOptionWrap
                  }
                  onPress={() => this.setSelectedColor('#090C08')}
                >
                  <View style={[styles.colorOption, styles.optionOne]}></View>
                </Pressable>

                <Pressable 
                  style={this.state.selectedColor === '#474056' ? 
                    [styles.colorOptionWrap, styles.colorActive] : 
                    styles.colorOptionWrap
                  }
                  onPress={() => this.setSelectedColor('#474056')}
                >
                  <View style={[styles.colorOption, styles.optionTwo]}></View>
                </Pressable>

                <Pressable 
                  style={this.state.selectedColor === '#8A95A5' ? 
                    [styles.colorOptionWrap, styles.colorActive] : 
                    styles.colorOptionWrap
                  }
                  onPress={() => this.setSelectedColor('#8A95A5')}
                >
                  <View style={[styles.colorOption, styles.optionThree]}></View>
                </Pressable>

                <Pressable 
                  style={this.state.selectedColor === '#B9C6AE' ? 
                    [styles.colorOptionWrap, styles.colorActive] : 
                    styles.colorOptionWrap
                  }
                  onPress={() => this.setSelectedColor('#B9C6AE')}
                >
                  <View style={[styles.colorOption, styles.optionFour]}></View>
                </Pressable>
              </View>
            </View>

            <Pressable 
              style={styles.buttonWrap}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.text, background: this.state.selectedColor })}
            ><Text style={styles.button}>Start Chatting</Text></Pressable>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: '6%',
    paddingVertical: '6%'
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 60
  },

  userInfoContainer: {
    width: '100%',
    minHeight: '44%',
    paddingHorizontal: '6%',
    paddingVertical: '6%',
    marginTop: 'auto',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  inputBox: {
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  inputIconWrap: {
    opacity: 0.5
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    paddingVertical: 16,
    marginLeft: 8
  },

  colorWrap: {
    marginTop: 16
  },

  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1
  },

  colorOptions: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 16
  },

  colorOptionWrap: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    marginRight: 16
  },

  colorActive: {
    borderColor: '#000000'
  },

  colorOption: {
    width: 40,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 20,
  },

  optionOne: {
    backgroundColor: '#090C08'
  },

  optionTwo: {
    backgroundColor: '#474056'
  },

  optionThree: {
    backgroundColor: '#8A95A5'
  },

  optionFour: {
    backgroundColor: '#B9C6AE'
  },

  buttonWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#757083',
    width: '100%',
    paddingVertical: 16,
    marginTop: 24
  }
});