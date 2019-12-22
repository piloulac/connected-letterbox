import React, { Component } from 'react';
import { Platform, Text, View } from 'react-native';
import styles from './styles';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

class DefaultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
      updateAnswer: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text>{instructions}</Text>
      </View>
    );
  }
}

export default DefaultScreen;
