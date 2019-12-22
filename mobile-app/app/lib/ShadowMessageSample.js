export function getWidhdrawnMessage() {
  return {
    desired: {
      receivedLetters: 0,
      doorOpened: false
    }
  };
}

export function getWaitingForParcelMessage(state) {
  return {
    desired: {
      waitingForParcel: state
    }
  };
}

export function getNumberOfLettersBeforeNotificationMessage(value) {
  return {
    desired: {
      numberOfLettersBeforeNotifications: value
    }
  };
}
