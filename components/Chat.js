import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name, background } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ backgroundColor: background, width: '100%', height: '100%' }}>
        <Text>Some Text</Text>
      </View>
    );
  }
}