---
layout: post
title: "Weather station"
date:   2014-01-01
tags: [projects]
---
# Weather Station
![Main picture](/images/weather_station/main.jpg)As my first project to dive into uC proramming is based on Atmega328P with Arduino bootloader. The main target of this device is to have some basic information about the climat (Humidity, Temperature, Atmospheric Pressure).
I have created two kinds of this project. One built-up in the wall and one as stand alone device.
I had a need to control brightness of LEDs stripe behind the TV so I decided to include this feature by using simple MOSFET driver.

## Displaying information on 16x2 LCD.
The display shows one parameter at the time. The delay time to switch to another measurement is about 3s. By pressing the button we can light up the backlight.
LCD is controlled with the shift register (74HC595) to save microcontroller`s pins.

## Fit the LEDs brightness to the room lightening.
![TV](/images/weather_station/TV.PNG)To have LED strip behind my TV I thought it is important to not have too bright light there. I decided to measure the lighting in the room and create proper duty cycle of PWM.
In my opinion this operation creates nice shadows that highlight the TV`s slot in the wall.

Sensors I have used.
-I measure humidity and temperature using - DHT11.
-I measure Atmospheric Pressure - BMP180.
-I measure light brightness using photoresistor.

This project was done to learn how microcontrollers work and understand the way to programm in C language. It was one of my first steps to start programming in clean C. I have used Using Arduino IDE to write the programm and debug problems.

## What I would do better?
- Improve PCB layout.
- Add watchdog! - From time to time I have problem with display and I need to reset the device by switching off main power switch. It is not often but it happens.
