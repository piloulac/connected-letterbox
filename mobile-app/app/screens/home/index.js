import React, { Component } from 'react';
import { Text, Platform, View } from 'react-native';

import { getLetterColor, showConnectivityErrorMessage, isNetworkConnected, lastSync } from '../../lib/Utils';
import { Navigation } from 'react-native-navigation';

import { getShadowFromAWSIoT, updateShadowStateFromAWSIoT } from '../../lib/AWSIoTGateway';
import { getWaitingForParcelMessage } from '../../lib/ShadowMessageSample';
import ReceivedLetters from '../../components/receivedLetters';
import WaitingForParcel from '../../components/waitingForParcel';
import BottomActionButton from '../../components/bottomActionButton';

import styles from './styles';

class Home extends Component {
  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    // set global state of the application
    // will be passed through each transition
    this.state = {
      answer: null,
      receivedLetters: 0,
      doorOpened: false,
      waitingForParcel: false,
      numberOfLettersBeforeNotifications: 3,
      lastUpdate: '  ',
      loading: false
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleWaitingForParcel = this.handleWaitingForParcel.bind(this);
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') {
      // this is the event type for button presses
      if (event.id == 'settings') {
        console.log('settings button pushed');
        Navigation.showModal({
          screen: 'myletterbox.Settings', // unique ID registered with Navigation.registerScreen
          title: 'Settings', // title of the screen as appears in the nav bar (optional)
          passProps: {
            numberOfLettersBeforeNotifications: this.state.numberOfLettersBeforeNotifications,
            handleUpdateNumberOfLettersBeforeNotification: this.handleRefresh
          }, // simple serializable object that will pass as props to the modal (optional)
          animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
      }
    }
  }

  componentDidMount() {
    this.handleRefresh();
  }

  showLoading(flag) {
    if (flag) {
      Navigation.showLightBox({
        screen: 'myletterbox.Loading', // unique ID registered with Navigation.registerScreen
        passProps: { message: "We're updating your letter box!" }, // simple serializable object that will pass as props to the lightbox (optional)
        style: {
          backgroundBlur: 'light', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
          backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255, 0.6)' : 'rgba(0, 0, 0, 0)'
        },
        adjustSoftInput: 'resize'
      });
    } else {
      Navigation.dismissLightBox();
    }
  }

  startLoading() {
    this.setState({ loading: true });
  }

  stopLoading() {
    this.setState({ loading: false });
  }

  handleRefresh() {
    //this.setState({loading:true});
    let datetime = lastSync();
    isNetworkConnected().done(isConnected => {
      if (isConnected) {
        this.startLoading();
        getShadowFromAWSIoT().then(res => {
          this.stopLoading();
          this.setState({
            receivedLetters: res.state.desired.receivedLetters,
            doorOpened: res.state.desired.doorOpened,
            waitingForParcel: res.state.desired.waitingForParcel,
            numberOfLettersBeforeNotifications: res.state.desired.numberOfLettersBeforeNotifications,
            lastUpdate: datetime
          });
        });
      } else {
        showConnectivityErrorMessage();
      }
    });
  }

  handleWaitingForParcel(state) {
    isNetworkConnected().done(isConnected => {
      if (isConnected) {
        updateShadowStateFromAWSIoT(getWaitingForParcelMessage(state)).then(() => {
          this.setState({ waitingForParcel: state });
          if (state) {
            Navigation.showInAppNotification({
              screen: 'myletterbox.Notification', // unique ID registered with Navigation.registerScreen
              passProps: {
                title: 'Waiting for Parcel',
                content: "You're now waiting for a parcel"
              }, // simple serializable object that will pass as props to the in-app notification (optional)
              autoDismissTimerSec: 2 // auto dismiss notification in seconds
            });
          }
        });
      } else {
        showConnectivityErrorMessage();
      }
    });
  }

  render() {
    this.showLoading(this.state.loading);
    return (
      <View>
        <View style={styles.lastUpdateContainer}>
          <Text style={styles.lastUpdate}>{this.state.lastUpdate}</Text>
        </View>

        <ReceivedLetters
          receivedLetters={this.state.receivedLetters}
          color={getLetterColor(this.state.receivedLetters)}
        />

        <WaitingForParcel
          waitingForParcel={this.state.waitingForParcel}
          doorOpened={this.state.doorOpened}
          handleWaitingForParcel={this.handleWaitingForParcel}
        />

        <BottomActionButton handleRefresh={this.handleRefresh} />
      </View>
    );
  }
}

export default Home;
