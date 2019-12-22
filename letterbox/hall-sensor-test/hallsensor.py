#!/usr/bin/env python

import time
import pigpio

#
#
# Pin 1 - 5V
# Pin 2 - Ground
# Pin 3 - gpio (here Pin number 8, gpio 14)
#
# The internal gpio pull-up is enabled so that the sensor
# normally reads high.  It reads low when a magnet is close.
#

HALL=14

pi = pigpio.pi() # connect to local Pi

pi.set_mode(HALL, pigpio.INPUT)
pi.set_pull_up_down(HALL, pigpio.PUD_UP)

start = time.time()

while (time.time() - start) < 60:
    if pi.read(HALL):
        print("no magnet")
    else:
        print("magnet")
    time.sleep(1)

#   with open('hallsensor.txt','w') as f:
#       f.write("%s", (int(pi.read(HALL))))
#   f.close()

pi.stop()
