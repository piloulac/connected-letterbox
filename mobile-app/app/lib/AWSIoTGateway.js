import {
  accessKeyId,
  secretAccessKey,
  deviceName,
  host,
  region
} from "../config/settings";
var AWSSignature = require("react-native-aws-signature");

let credentials = {
  SecretKey: secretAccessKey,
  AccessKeyId: accessKeyId
};

function amzLongDate(date) {
  return date
    .toISOString()
    .replace(/[:\-]|\.\d{3}/g, "")
    .substr(0, 17);
}

function getmyAuthorizationUpdate(value) {
  var awsSignature = new AWSSignature();
  date = new Date();
  amzdate = amzLongDate(date);

  var options = {
    path: "/things/" + deviceName + "/shadow",
    method: "POST",
    service: "iotdata",
    headers: {
      "X-Amz-Date": amzdate,
      host: host
    },
    region: region,
    body: JSON.stringify({
      state: value
    }),
    credentials
  };

  awsSignature.setParams(options);
  var authorization = awsSignature.getAuthorizationHeader();

  return [authorization.Authorization, amzdate];
}

function getmyAuthorizationGet() {
  var awsSignature = new AWSSignature();
  date = new Date();
  amzdate = amzLongDate(date);

  var options = {
    path: "/things/" + deviceName + "/shadow",
    method: "GET",
    service: "iotdata",
    headers: {
      "X-Amz-Date": amzdate,
      host: host
    },
    region: region,
    body: "",
    credentials
  };

  awsSignature.setParams(options);
  var authorization = awsSignature.getAuthorizationHeader();

  return [authorization.Authorization, amzdate];
}

function handleErrors(response) {
  if (!response.ok) {
    console.info("handle errors" + response);
    throw Error(response.statusText);
  }
  return response;
}

export function getShadowFromAWSIoT() {
  var conn = getmyAuthorizationGet(); //conn[0] == authorization, conn[1] == amzdate
  console.debug("conn= " + conn);
  return fetch("https://" + host + "/things/" + deviceName + "/shadow", {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Host: host,
      Authorization: conn[0],
      "x-amz-date": conn[1]
    }
  })
    .then(this.handleErrors)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}

export function updateShadowStateFromAWSIoT(value) {
  var conn = getmyAuthorizationUpdate(value); //conn[0] == authorization, conn[1] == amzdate
  console.debug("conn= " + conn);
  return fetch("https://" + host + "/things/" + deviceName + "/shadow", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Host: host,
      Authorization: conn[0],
      "x-amz-date": conn[1]
    },
    body: JSON.stringify({
      state: value
    })
  })
    .then(this.handleErrors)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.error(error);
    });
}
