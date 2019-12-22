import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { Icon } from 'react-native-elements';

class ReceivedLetters extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.circleContainer}>
          <Text style={{ fontSize: 50, color: this.props.color }}>{this.props.receivedLetters}</Text>

          <Icon name="email" size={60} type="material-community" color={this.props.color} />

          <Text style={{ color: this.props.color }}>Received letters</Text>
        </View>
      </View>
    );
  }
}

export default ReceivedLetters;
