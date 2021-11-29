// Packages
import React from 'react';
import { View, Text } from 'react-native';

/**
 * Chat component receives user name and background color hex code
 */
export default class Chat extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });
  }

  render() {
    let { background } = this.props.route.params;

    return (
      <View style={{ backgroundColor: background, width: '100%', height: '100%' }}>
        <Text>Display Chat Here</Text>
      </View>
    );
  }
}