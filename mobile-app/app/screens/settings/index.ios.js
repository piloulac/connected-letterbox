import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { Navigation } from 'react-native-navigation';
import { Button } from 'react-native-elements';
import SimpleStepper from 'react-native-simple-stepper';
import { updateShadowStateFromAWSIoT } from '../../lib/AWSIoTGateway';
import { getNumberOfLettersBeforeNotificationMessage } from '../../lib/ShadowMessageSample';

class Settings extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../../img/clear.png'),
        id: 'clear'
      }
    ]
  };

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'clear') {
        Navigation.dismissModal({
          animationType: 'slide-down'
        });
      }
    }
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      numberOfLettersBeforeNotifications: 3,
      updateDisabled: true
    };
  }

  componentWillMount() {
    this.setState({
      numberOfLettersBeforeNotifications: this.props.numberOfLettersBeforeNotifications
    });
  }

  valueChanged(value) {
    this.setState({
      numberOfLettersBeforeNotifications: value
    });
    if (value != this.props.numberOfLettersBeforeNotifications) {
      this.setState({
        updateDisabled: false
      });
    } else {
      this.setState({
        updateDisabled: true
      });
    }
  }

  update(value) {
    updateShadowStateFromAWSIoT(getNumberOfLettersBeforeNotificationMessage(value)).then(() => {
      this.props.handleUpdateNumberOfLettersBeforeNotification();

      Navigation.dismissModal({
        animationType: 'slide-down'
      }).then(() =>
        Navigation.showInAppNotification({
          screen: 'myletterbox.Notification', // unique ID registered with Navigation.registerScreen
          passProps: {
            title: 'Number of Letters before notifications',
            content: 'New limit set to: ' + value + ' letters'
          }, // simple serializable object that will pass as props to the in-app notification (optional)
          autoDismissTimerSec: 2 // auto dismiss notification in seconds
        })
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>You will be notified after </Text>
            <Text style={styles.number}>{this.state.numberOfLettersBeforeNotifications}</Text>
            <Text style={styles.text}> letters</Text>
          </View>
          <SimpleStepper
            initialValue={this.state.numberOfLettersBeforeNotifications}
            valueChanged={value => this.valueChanged(value)}
            tintColor="#ffcc00"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="UPDATE"
            backgroundColor="#ffcc00"
            onPress={() => this.update(this.state.numberOfLettersBeforeNotifications)}
            disabled={this.state.updateDisabled}
          />
        </View>
      </View>
    );
  }
}

export default Settings;
