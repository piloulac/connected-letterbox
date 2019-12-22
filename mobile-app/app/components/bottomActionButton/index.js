import React, { Component } from 'react';
import { Text, View, Alert, NetInfo } from 'react-native';
import styles from './styles';
import { Icon } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { updateShadowStateFromAWSIoT } from '../../lib/AWSIoTGateway';
import { getWidhdrawnMessage } from '../../lib/ShadowMessageSample';
import { showConnectivityErrorMessage } from '../../lib/Utils';

class BottomActionButton extends Component {
  withdrawn(refresh) {
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        Alert.alert(
          'Withdrawn',
          'Do you confirm your withdrawn? It will reset your counters',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () =>
                updateShadowStateFromAWSIoT(getWidhdrawnMessage()).then(() => {
                  refresh();
                  Navigation.showInAppNotification({
                    screen: 'myletterbox.Notification', // unique ID registered with Navigation.registerScreen
                    passProps: {
                      title: 'Withdrawn',
                      content: 'Your letterbox has been clean'
                    }, // simple serializable object that will pass as props to the in-app notification (optional)
                    autoDismissTimerSec: 2 // auto dismiss notification in seconds
                  });
                })
            }
          ],
          { cancelable: false }
        );
      } else {
        showConnectivityErrorMessage();
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Icon
            raised
            name="email-open"
            type="material-community"
            color="#f50"
            onPress={() => this.withdrawn(this.props.handleRefresh)}
          />
          <Text style={{ fontSize: 10 }}>Withdrawn</Text>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Icon raised name="reload" type="material-community" color="#07BEB8" onPress={this.props.handleRefresh} />
          <Text style={{ fontSize: 10 }}>Refresh</Text>
        </View>
      </View>
    );
  }
}

export default BottomActionButton;
