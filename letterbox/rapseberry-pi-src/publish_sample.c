/*
 * Copyright 2010-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/**
 * @file subscribe_publish_sample.c
 * @brief simple MQTT publish and subscribe on the same topic
 *
 * This example takes the parameters from the aws_iot_config.h file and establishes a connection to the AWS IoT MQTT Platform.
 * It subscribes and publishes to the same topic - "sdkTest/sub"
 *
 * If all the certs are correct, you should see the messages received by the application in a loop.
 *
 * The application takes in the certificate path, host name , port and the number of times the publish should happen.
 *
 */
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <unistd.h>
#include <time.h>

#include <wiringPi.h>

#include <signal.h>
#include <memory.h>
#include <sys/time.h>
#include <limits.h>

#include "aws_iot_log.h"
#include "aws_iot_version.h"
#include "aws_iot_mqtt_interface.h"
#include "aws_iot_config.h"

#define TRIG 4
#define ECHO 5

void setup() {
        wiringPiSetup();
        pinMode(TRIG, OUTPUT);
        pinMode(ECHO, INPUT);

	//TRIG pin must start LOW
        digitalWrite(TRIG, LOW);
        delay(500);
}

int getCM() {
        //Send trig pulse
        digitalWrite(TRIG, HIGH);
        delayMicroseconds(10);
        digitalWrite(TRIG, LOW);

	//Wait for echo start
        while(digitalRead(ECHO) == LOW);

        //Wait for echo end
        long startTime = micros();
        while(digitalRead(ECHO) == HIGH);
        long endTime = micros();
        long travelTime = endTime - startTime;
        //Get distance in cm
        int distance = travelTime / 58;
        INFO("distance: %d", distance);
        return distance;
}

int MQTTcallbackHandler(MQTTCallbackParams params) {

	INFO("Subscribe callback");
	INFO("%.*s\t%.*s",
			(int)params.TopicNameLen, params.pTopicName,
			(int)params.MessageParams.PayloadLen, (char*)params.MessageParams.pPayload);

	return 0;
}

void disconnectCallbackHandler(void) {
	WARN("MQTT Disconnect");
	IoT_Error_t rc = NONE_ERROR;
	if(aws_iot_is_autoreconnect_enabled()){
		INFO("Auto Reconnect is enabled, Reconnecting attempt will start now");
	}else{
		WARN("Auto Reconnect not enabled. Starting manual reconnect...");
		rc = aws_iot_mqtt_attempt_reconnect();
		if(RECONNECT_SUCCESSFUL == rc){
			WARN("Manual Reconnect Successful");
		}else{
			WARN("Manual Reconnect Failed - %d", rc);
		}
	}
}

/**
 * @brief Default cert location
 */
char certDirectory[PATH_MAX + 1] = "../../certs";

/**
 * @brief Default MQTT HOST URL is pulled from the aws_iot_config.h
 */
char HostAddress[255] = AWS_IOT_MQTT_HOST;

/**
 * @brief Default MQTT port is pulled from the aws_iot_config.h
 */
uint32_t port = AWS_IOT_MQTT_PORT;

/**
 * @brief This parameter will avoid infinite loop of publish and exit the program after certain number of publishes
 */
uint32_t publishCount = 0;
time_t secs;

void parseInputArgsForConnectParams(int argc, char** argv) {
	int opt;

	while (-1 != (opt = getopt(argc, argv, "h:p:c:x:"))) {
		switch (opt) {
		case 'h':
			strcpy(HostAddress, optarg);
			DEBUG("Host %s", optarg);
			break;
		case 'p':
			port = atoi(optarg);
			DEBUG("arg %s", optarg);
			break;
		case 'c':
			strcpy(certDirectory, optarg);
			DEBUG("cert root directory %s", optarg);
			break;
		case 'x':
			publishCount = atoi(optarg);
			DEBUG("publish %s times\n", optarg);
			break;
		case '?':
			if (optopt == 'c') {
				ERROR("Option -%c requires an argument.", optopt);
			} else if (isprint(optopt)) {
				WARN("Unknown option `-%c'.", optopt);
			} else {
				WARN("Unknown option character `\\x%x'.", optopt);
			}
			break;
		default:
			ERROR("Error in command line argument parsing");
			break;
		}
	}

}

int main(int argc, char** argv) {
	IoT_Error_t rc = NONE_ERROR;
	int32_t i = 0;
	bool infinitePublishFlag = true;

	char rootCA[PATH_MAX + 1];
	char clientCRT[PATH_MAX + 1];
	char clientKey[PATH_MAX + 1];
	char CurrentWD[PATH_MAX + 1];
	char cafileName[] = AWS_IOT_ROOT_CA_FILENAME;
	char clientCRTName[] = AWS_IOT_CERTIFICATE_FILENAME;
	char clientKeyName[] = AWS_IOT_PRIVATE_KEY_FILENAME;

	parseInputArgsForConnectParams(argc, argv);

	INFO("\nAWS IoT SDK Version %d.%d.%d-%s\n", VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, VERSION_TAG);

	getcwd(CurrentWD, sizeof(CurrentWD));
	sprintf(rootCA, "%s/%s/%s", CurrentWD, certDirectory, cafileName);
	sprintf(clientCRT, "%s/%s/%s", CurrentWD, certDirectory, clientCRTName);
	sprintf(clientKey, "%s/%s/%s", CurrentWD, certDirectory, clientKeyName);

	DEBUG("rootCA %s", rootCA);
	DEBUG("clientCRT %s", clientCRT);
	DEBUG("clientKey %s", clientKey);

	MQTTConnectParams connectParams = MQTTConnectParamsDefault;

	connectParams.KeepAliveInterval_sec = 10;
	connectParams.isCleansession = true;
	connectParams.MQTTVersion = MQTT_3_1_1;
	connectParams.pClientID = "CSDK-test-device";
	connectParams.pHostURL = HostAddress;
	connectParams.port = port;
	connectParams.isWillMsgPresent = false;
	connectParams.pRootCALocation = rootCA;
	connectParams.pDeviceCertLocation = clientCRT;
	connectParams.pDevicePrivateKeyLocation = clientKey;
	connectParams.mqttCommandTimeout_ms = 2000;
	connectParams.tlsHandshakeTimeout_ms = 5000;
	connectParams.isSSLHostnameVerify = true; // ensure this is set to true for production
	connectParams.disconnectHandler = disconnectCallbackHandler;

	INFO("Connecting...");
	rc = aws_iot_mqtt_connect(&connectParams);
	if (NONE_ERROR != rc) {
		ERROR("Error(%d) connecting to %s:%d", rc, connectParams.pHostURL, connectParams.port);
	}
	/*
	 * Enable Auto Reconnect functionality. Minimum and Maximum time of Exponential backoff are set in aws_iot_config.h
	 *  #AWS_IOT_MQTT_MIN_RECONNECT_WAIT_INTERVAL
	 *  #AWS_IOT_MQTT_MAX_RECONNECT_WAIT_INTERVAL
	 */
	rc = aws_iot_mqtt_autoreconnect_set_status(true);
	if (NONE_ERROR != rc) {
		ERROR("Unable to set Auto Reconnect to true - %d", rc);
		return rc;
	}

	MQTTMessageParams Msg = MQTTMessageParamsDefault;
	Msg.qos = QOS_0;
	char cPayload[100];
	sprintf(cPayload, "%s : %d ", "hello from SDK", i);
	Msg.pPayload = (void *) cPayload;

    //set param topic for letters
	MQTTPublishParams ParamsLetter = MQTTPublishParamsDefault;
	ParamsLetter.pTopic = "sensor/letter";
    
    //set param topic for door
    MQTTPublishParams ParamsDoor = MQTTPublishParamsDefault;
    ParamsDoor.pTopic = "sensor/door";

	if (publishCount != 0) {
		infinitePublishFlag = false;
	}

	//reading sensor
	//setup
	setup();
	FILE *fp;
	int size = 8;
	char data[255];
	int hall;
    bool didInitHallSensorState = false;
    int hallPreviousState;

	while ((NETWORK_ATTEMPTING_RECONNECT == rc || RECONNECT_SUCCESSFUL == rc || NONE_ERROR == rc)
			&& (publishCount > 0 || infinitePublishFlag)) {

		//Max time the yield function will wait for read messages
		rc = aws_iot_mqtt_yield(100);
		if(NETWORK_ATTEMPTING_RECONNECT == rc){
			INFO("-->sleep");
			sleep(1);
			// If the client is attempting to reconnect we will skip the rest of the loop.
			continue;
		}
		INFO("-->sleep");
		sleep(1);

		//read hall sensor log from hallsensor.txt file
		if ((fp = fopen("./hallsensor.txt", "r")) == NULL){
			ERROR("error on opening hall sensor file\n");
		}
		else{
			fgets(data,size,fp);
			hall = atoi(data);
			fclose(fp);
			INFO("hall sensor : %d",hall);
            if(!didInitHallSensorState){
                hallPreviousState = hall;
                didInitHallSensorState = true;
            }
		}

		//check the distance detected by the sonar sensor
		if ((getCM()<15) && (hall == 1)){
            time(&secs);
            struct tm *local = localtime(&secs);
            //creating the payload of the letter message
			sprintf(cPayload, "{ \"time\":\"%02d:%02d:%02d\", \"payload\":\"%s\"}",local->tm_hour, local->tm_min, local->tm_sec, "new letter");
            //sending the message to AWS at 'sensor/letter' topic
            Msg.PayloadLen = strlen(cPayload);
            ParamsLetter.MessageParams = Msg;
            rc = aws_iot_mqtt_publish(&ParamsLetter);
            //wait here 2 seconds to be sure that the letter is well arrived
            sleep(2);
            INFO("A NEW LETTER HAS BEEN PUBLISHED TO sensor/letter");
		}
        
        //check the state of the door
        if (hall == 0 && hallPreviousState != hall){
            time(&secs);
            struct tm *local = localtime(&secs);
			sprintf(cPayload, "{ \"time\":\"%02d:%02d:%02d\", \"payload\":\"%s\"}",local->tm_hour, local->tm_min, local->tm_sec, "door open");
            //sending the message to AWS at 'sensor/door' topic
            Msg.PayloadLen = strlen(cPayload);
            ParamsDoor.MessageParams = Msg;
            rc = aws_iot_mqtt_publish(&ParamsDoor);

            INFO("DOOR HAS BEEN OPENED TO sensor/door");
		}
        
        hallPreviousState = hall;
	}

	if (NONE_ERROR != rc) {
		ERROR("An error occurred in the loop.\n");
	} else {
		INFO("Publish done\n");
	}

	return rc;
}

