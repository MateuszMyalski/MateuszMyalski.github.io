---
layout: post
title: "Counter module - auto up, down"
date: 2016-03-23
categories: [projects]
---
# Counter module - auto up/down counting
![Main picture](/images/counter/main_low.png)
One of my teacher have asked me "Can you demonstrate how we can use basic digital ICs?". I came up with an idea. I decided to make a digital circuit that automatically will count up (from 0 to 9), and when the limit will be reached it will start decreasing the value (from 9 to 0).

## Double sandwich board.
![Dual board](/images/counter/dual_board_low.png)
The top board is for counting and decoding. The bottom board is for whole logic that decide when to count up or down. Two boards are connected by using gold pins, so they can easily snap on each other.
I am using simple monostable circuit on _NE555_ for switch debouncing.

## How it works!?
This gif shows how all works together!
![Counting](/images/counter/counting.gif)