import { Dimensions } from "react-native";

export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

var certsJson = require("../../config.json");

export const accessKeyId = certsJson.accessKeyId;
export const secretAccessKey = certsJson.secretAccessKey;
export const deviceName = certsJson.deviceName;
export const host = certsJson.host;
export const region = certsJson.region;
export const database = certsJson.database;
