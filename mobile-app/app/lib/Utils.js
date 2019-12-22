import { Navigation } from "react-native-navigation";
import { Platform, NetInfo } from "react-native";

export function getLetterColor(value) {
  switch (true) {
    case value < 3:
      return "#00cc00";
    case value >= 3 && value < 5:
      return "#ccff33";
    case value >= 5 && value < 7:
      return "#ff6600";
    case value >= 7:
      return "#ff0000";
  }
}

export function lastSync() {
  let currentdate = new Date();
  return (
    "Last Sync: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds()
  );
}

export function showConnectivityErrorMessage() {
  Navigation.showInAppNotification({
    screen: "myletterbox.Notification", // unique ID registered with Navigation.registerScreen
    passProps: {
      title: "Error",
      content: "No connectivity",
      typeMessage: "error"
    }, // simple serializable object that will pass as props to the in-app notification (optional)
    autoDismissTimerSec: 1 // auto dismiss notification in seconds
  });
}

export function isNetworkConnected() {
  if (Platform.OS === "ios") {
    return new Promise(resolve => {
      const handleFirstConnectivityChangeIOS = isConnected => {
        NetInfo.isConnected.removeEventListener(
          "connectionChange",
          handleFirstConnectivityChangeIOS
        );
        resolve(isConnected);
      };
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        handleFirstConnectivityChangeIOS
      );
    });
  }

  return NetInfo.isConnected.fetch();
}

// create the array of all objects
export function createDataObjects(items) {
  var list = [];
  for (var i in items) {
    item = items[i];
    console.log(items[i]);
    var object = {};
    if (item.type == "letter") {
      object = createDataObject(
        "mail-outline",
        "Received letter",
        item.payload.id.S
      );
    }
    if (item.type == "door") {
      object = createDataObject(
        "move-to-inbox",
        "Open door",
        item.payload.id.S
      );
    }
    list.push(object);
  }

  // return the 10 first elements
  return list.sort(compareId).slice(0, 10);
}

// function to sort ID's
function compareId(a, b) {
  if (a.id < b.id) return 1;
  if (a.id > b.id) return -1;
  return 0;
}

// create one object
function createDataObject(icon, name, id) {
  var object = {};
  object.icon = icon;
  object.name = name;
  object.id = id;
  object.datetime = createDateTimeStringFromID(id);
  return object;
}

// return the ID parse to Date - time
function createDateTimeStringFromID(id) {
  date_ =
    id.substring(0, 4) + "/" + id.substring(4, 6) + "/" + id.substring(6, 8);
  time_ =
    id.substring(8, 10) +
    ":" +
    id.substring(10, 12) +
    ":" +
    id.substring(12, 14);
  console.log("date = " + date_ + ", time =" + time_);
  return date_ + " at " + time_;
}
