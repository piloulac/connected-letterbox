/*
* you should connect your HC-SR04 sensor as follow:
* -VCC to 5V (beware to burning. We should use a resistor)
* -GNGD to ground
* -TRIG to pin number 16
* -ECHO to pin number 18
*/

#include <stdio.h>
#include <stdlib.h>
#include <wiringPi.h>

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
        return distance;
}

int main(void) {
        setup();
	while(1){
		sleep(2);
		if (getCM()<15){
			printf("a new letter as just arrived!\n");
        	}
	}
        return 0;
}
