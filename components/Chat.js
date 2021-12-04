// Packages
import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, Day, GiftedChat } from 'react-native-gifted-chat';

/**
 * Chat component receives user name and background color hex code
 */
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      backgroundColor: props.route.params.background
    }
  }

  /**
   * Adds user's entered name to the navigation title.
   */
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      messages: [
        {
          _id: 2,
          text: 'Hi React Native!',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Alex',
            avatar: ''
          }
        },
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any'
          }
        }
      ]
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
    }));
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

    return (
      <View style={[styles.chatContainer, { backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
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