# Read data from A3144 hall sensor

How read data from A3144 hall sensor?
For now we read data from a python script. What we should do is store this value in a text file.
Then, from a C file when we need to publish data to AWS we read this file.

I added a commented code in the file which can write the result in a file called hallsensor.txt

------

## How connect the sensor?
You should connect your sensor as follow:
1. Pin 1 - 5V
2. Pin 2 - Ground
3. Pin 3 - gpio (here Pin number 8 on the raspberryPi it corresponds to gpio 14)

## How make it works?
First make sure that you have `pigpio` installed on your raspberry.
If needed:
`sudo apt-get install pigpio python-pigpio python3-pigpio`.

Then, start pigpio deamon with:
`sudo pigpiod`

You're ready to launch your script! 
`python hallsensor.py`
