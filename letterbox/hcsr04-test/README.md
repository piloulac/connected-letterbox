# Read data from HC-SR04 sensor

How read distance from the HC-SR04 sensor?

------
Normally we'd like to use an IR sensor but I didn't manage to make it works. Then I started working on the sonar sensor.

## How connect the sensor?
you should connect your HC-SR04 sensor as follow:
1. VCC to 5V (beware to burning. We should use a resistor)
2. GNGD to ground
3. TRIG to pin number 16
4. ECHO to pin number 18

##H ow compile file with WiringPi?
First, you should [download and install WiringPi](http://wiringpi.com/download-and-install/)!

then just launch:
`gcc -Wall -o readhcsr04 readhcsr04.c -lwiringPi`
