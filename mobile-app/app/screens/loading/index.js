import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { Bars } from 'react-native-loader';

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{this.props.message}</Text>
        <Bars size={10} color="#07BEB8" />
      </View>
    );
  }
}

export default Loading;
