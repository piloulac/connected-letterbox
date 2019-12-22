import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { Icon } from 'react-native-elements';

class Offline extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.circleContainer}>
          <Text style={styles.text}>You are offline</Text>

          <Icon name="airplane-off" size={60} type="material-community" />

          <Text style={styles.text}>Try to reconnect before fetching data</Text>
        </View>
      </View>
    );
  }
}

export default Offline;
