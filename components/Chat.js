// Packages
import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, Day, GiftedChat } from 'react-native-gifted-chat';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/**
 * Chat component receives user name and background color hex code
 */
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      backgroundColor: props.route.params.background,
      uid: 0
    }

    const firebaseConfig = {
      apiKey: "AIzaSyDYR2knwd2aldz0Wte9RNV6AUMIXUiW3p4",
      authDomain: "chit-chat-267a1.firebaseapp.com",
      projectId: "chit-chat-267a1",
      storageBucket: "chit-chat-267a1.appspot.com",
      messagingSenderId: "716853407824",
      appId: "1:716853407824:web:db71a43cdf72fe970ee155",
      measurementId: "${config.measurementId}"
    };

    let app;

    if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }

    this.referenceMessagesUser = null;
  }

  /**
   * Adds user's entered name to the navigation title.
   */
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Create a reference to messages collection
    this.referenceMessages = firebase.firestore().collection('messages');

    // Listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      if (user) {
        // Update user state with currently active user data
        this.setState({
          uid: user.uid,
          messages: []
        });

        // Create a reference to the active user's documents (messages)
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);

        // Listen for collection changes for current user
        this.unsubscribeMessageUser = this.referenceMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot((querySnapshot) => this.onCollectionUpdate(querySnapshot));
      }
    });
  }

  componentWillUnmount() {
    // Stop listening for authentication
    this.authUnsubscribe();

    // Stop listening for changes
    this.unsubscribeMessageUser();
  }

  onCollectionUpdate(querySnapshot) {
    const messages = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });

    this.setState({
      messages: messages
    });
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: {
        _id: message.user._id,
        name: message.user.name || '',
        avatar: message.user.avatar || ''
      }
    });
  }

  /**
   * 
   * @param {*} messages 
   * Merges messages states to store current and new messages
   */
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    });
  }

  /**
   * 
   * @param {*} props 
   * @returns Bubble component
   * Sets background of user's chat bubble to hex code `#000`
   */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    );
  }

  /**
   * 
   * @param {*} props 
   * @returns Day component
   * Sets day text color to something readable depending on the
   * background color.
   */
  renderDay(props) {
    const { backgroundColor } = this.state;
    let dayColor = '#CDCDCD';

    if (backgroundColor === '#8A95A5') dayColor = '#FFFFFF';
    if (backgroundColor === '#B9C6AE') dayColor = '#000000';
    return (
      <Day {...props} textStyle={{color: dayColor}} />
    );
  }

  /**
   * 
   * @returns Chat component
   * Renders GiftedChat component with saved messages.
   * Sets background color to the color the user selected in previous step.
   */
  render() {
    let { backgroundColor } = this.state;
    let { name } = this.props.route.params;

    return (
      <View style={[styles.chatContainer, { backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: name,
            avatar: 'https://placeimg.com/140/140/any' 
          }}
          renderDay={this.renderDay.bind(this)}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1
  }
});