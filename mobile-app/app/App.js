import { Navigation } from "react-native-navigation";
import { Platform } from "react-native";

import { registerScreens } from "./screens";

import { setCustomText } from "react-native-global-props";

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: "Lato",
    color: "black"
  }
};

setCustomText(customTextProps);

registerScreens(); // this is where you register all of your app's screens

const navButtons = {
  rightButtons: [
    {
      icon: require("./img/settings.png"), // for icon button, provide the local image asset name
      id: "settings" // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
    }
  ]
};

const navigatorStyle = {
  navBarTextColor: "#07BEB8",
  navBarTextFontFamily: "Lato",
  navBarRightButtonColor: "white"
};

// start the app
Navigation.startTabBasedApp({
  tabs: [
    {
      label: "Home",
      screen: "myletterbox.Home", // this is a registered name for a screen
      icon: require("./img/home.png"),
      title: "My Letterbox",
      navigatorButtons: navButtons,
      navigatorStyle: navigatorStyle
    },
    {
      label: "Historic",
      screen: "myletterbox.Historic",
      icon: require("./img/history.png"),
      title: "History of you letterbox",
      navigatorStyle: navigatorStyle
    }
  ],
  appStyle: {
    tabBarSelectedButtonColor: "#07BEB8",
    tabBarTranslucent: false,
    tabFontFamily: "Lato" // existing font family name or asset file without extension which can be '.ttf' or '.otf' (searched only if '.ttf' asset not found)
  }
});
