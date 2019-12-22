import { Navigation } from "react-native-navigation";

import DefaultScreen from "./defaultScreen";
import Home from "./home";
import Settings from "./settings";
import Notification from "./notification";
import Historic from "./historic";
import Loading from "./loading";

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent(
    "myletterbox.DefaultScreen",
    () => DefaultScreen
  );
  Navigation.registerComponent("myletterbox.Home", () => Home);
  Navigation.registerComponent("myletterbox.Settings", () => Settings);
  Navigation.registerComponent("myletterbox.Historic", () => Historic);
  Navigation.registerComponent("myletterbox.Notification", () => Notification);
  Navigation.registerComponent("myletterbox.Loading", () => Loading);
}
