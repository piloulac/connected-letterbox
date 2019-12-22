import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={this.props.typeMessage != 'error' ? styles.container : styles.containerError}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.content}>{this.props.content}</Text>
      </View>
    );
  }
}

export default Notification;
