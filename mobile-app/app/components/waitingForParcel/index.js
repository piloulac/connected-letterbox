import React, { Component } from 'react';
import { Text, View, Switch } from 'react-native';
import styles from './styles';

class WaitingForParcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doorOpenedText: '  '
    };
  }

  getDoorOpenText() {
    if (this.props.doorOpened) {
      return '/!\\  Your letterbox has been opened recently  /!\\';
    } else {
      return ' ';
    }
  }

  handlerParcelState(value) {
    {
      this.props.handleWaitingForParcel(value);
    }
    this.setState({ waitingForParcel: value });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.smallText}>{this.getDoorOpenText()}</Text>
        <Switch onValueChange={value => this.handlerParcelState(value)} value={this.props.waitingForParcel} />
        <Text style={styles.text}>Waiting for parcel</Text>
      </View>
    );
  }
}

export default WaitingForParcel;
