---
title: Thinkpad keyboard backlight controller
date: 2024-09-29
layout: post
category: Projects
tags: linux
---
# Thinkpad keyboard backlight controller

Some time ago, I posted some notes about setting up a [minimal Debian installation](https://mateuszmyalski.github.io/post-configuration-for-minimal-debian-installation.html) installation. This came in handy when I was setting up my work environment on my refurbished Thinkpad T14s, which is now my personal workstation. It's my first Thinkpad, and I really like these products!

When I was deciding on a new laptop for personal projects, I didn’t want to spend too much money on equipment that I would mostly use from the command-line interface (CLI). Buying a refurbished laptop is not only more economical but also ecological, as you gain access to business-quality parts that typically last longer than those designed for the standard consumer market.

Now, back to the main topic.

To learn more about Linux and find inspiration for my next small project, I decided to improve how the keyboard backlight works on my laptop. I wanted full control over the brightness customization and system scheduling, so the backlight would activate when I started typing. Typically, available drivers trigger the backlight only after typing begins, which is often too late when I’m in a very dark room. I also wanted the backlight to activate when moving the mouse or touchpad. To save battery, my ideal setup would minimally illuminate the keyboard just enough to see the keys before I begin typing.

As you can probably guess, I couldn’t find such a controller. So, that’s why...

## I created my own controller

The controller provides the ability to manage the backlight of ThinkPad keyboards, with integrated Systemd support. It offers extensive features, including event-based backlight control, automatic brightness adjustments, and scheduling.

I coded this in bare C language without relying on any additional libraries. I don’t like tooling that forces me to set up a special environment just to blink an LED. For now, I’ve decided not to introduce any command-line configurations, as that would complicate the program unnecessarily. After all, how often do you really change your keyboard backlight?

The controller also allows you to disable the keyboard backlight based on time and battery level, preventing unnecessary battery drain when the LEDs would barely be visible during the day. Configuration is straightforward: all you need to do is edit the `config.h` header file, recompile the program, and reinstall the Systemd module. Everything can be done using the already-prepared Makefile.

The controller is available on my [github repository](https://github.com/MateuszMyalski/thinkpad-keybacklight), feel free to test it!


