---
layout: post
title: "Counter module - auto up, down"
date: 2016-03-23
---
![Main picture](/images/counter/main_low.png)

One of my teacher have asked me "Can you demonstrate how we can use basic digital ICs?". I came up with an idea. I decided to make a digital circuit that automatically will count up (from 0 to 9), and when the limit ia reached it starts decreasing the counter value (from 9 to 0).

## Double sandwich board.
![Dual board](/images/counter/dual_board_low.png)

The top board is circuit that take care of counting and decoding. The bottom board is a logic circuit that decide when to decrement/increment the counter value. Two boards are connected by using gold pins, so they can easily snap on each other.
While the board is clocked form standrad tact switch it needs propper debounce circuit, so I have used simple monostable circuit with _NE555_ for switch debouncing.

## How it works!?
This gif shows how all works together!

![Counting](/images/counter/counting.gif)
