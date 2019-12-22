# Letterbox

This repository contains 2 code samples and the actual code running on the raspberry pi.

## Code sample

1. [here]() gives an example of how to read distance with a HC-SR04 sensor
1. [here]() gives an example of how to read data from A3144 sensor

## Rapsberry 

The raspberry can send two kind of messages on two topics on AWS IoT Platform. The two topics are **sensor/letter** and **sensor/door** on which the messages related to a letters and door are delivered (smart isn't?).

This code get the data from 2 sensors: one hall sensor and one sonar sensor.

### Architecture 
1. The sonar sensor is directly read from the C file
1. The hall sensor, because of suppor issues, cannot be read from a C file. Therefore it read it with a python file, then write a result in a text file. From the C file we access this text file.

> The hall sensor is an ugly trick, but I had a time constraint and I had to find an easy solution

### Messages
The messages are sent with a JSON format following this template:

```json
{ 
    "time":"date_time_here",
    "payload":"your_payload_here"
}
```