---
layout: post
title: Memory Scratch Pad Protocol - PC interaction
date: 2020-12-11
---
# Memory Scratch Pad Protocol - PC interaction
After we have taught our microcontroller how to receive and respond to commands that comes from serial terminal, we have room for some improvements and automation from PC side. We can use C/C++ with proper library to handle serial communication. In case of Windows users it is possible to interact with virtual COM with WinApi. We are going to choose more universal solution.Python is ideal for task to create our protocol. On my repo you can find ready to use package that you can simply install via pip.

By using objective language it is possible to create simple model of our database just by using built-in features and one external package 'py-serial' We are going to divide our package into classes,that will handle bare connection and data model. Our module will automatically update internal registers and send proper commands.This will make our life simpler if we would like to write programs that interact with internal registers stored in our uC.

# Data transmission
The first thing we should create is data link layer. Let's create simple class that serves atomic method for receiving and sending data. In feature we can swap the method for sending/reading bytes to for e.g. sockets read/write.
```python
import serial

class SerialLink:
  def __init__(self, COM, baud_rate, timeout, stop_bits):
    self._serial = serial.Serial(
      f"COM{COM}",
      baudrate=baud_rate,
      timeout=timeout,
      bytesize=seria.EIGHTBITS,
      stopbits=stop_bits
    )
  
  def write_byte(self, byte: byte) -> None:
    self._serial.write(byte)

  def read_byte(self, length: int) -> bytearray:
    received = self._serial.read(length)
    return received
``` 

# Protocol implementation
Now it is time to create protocol class. This class is going to know how to format the command and how to parse the received data. 
```python
from .serial_link import SerialLink

class ScratchPadProtocol:
  response_length = 9

  def __init__(
      self,
      port: int = None,
      COM: int = None,
      baud_rate: int = None,
      stop_bits: int = 1,
      timeout: int = 1,
    ) -> None:
      self._transport = SerialLink(COM = COM, baud_rate = baud_rate, stop_bits = stop_bits, timeout = timeout)

  def read_address(self, address: int) -> bytes:
    cell = address.to_bytes(1, byteorder="big")
    self._transport.write_byte(cell)
    cell_value = self._transport.read_bytes(self.response_length)
    return cell_value

  def write_address(self, address: int, data: int) -> None:
    frame = [address, data]
    self._transport.write_byte(bytes(frame))

  def decode(self, received_frame: bytes) -> tuple:
    frame = received_frame.decode("UTF-8")
    # "0xXX:0xZZ" - 9 chars
    if len(frame) != 9:
      raise ValueError("Invalid response!") 

    cell, cell_value = frame.split(":")

    cell = int(cell, 16)
    cell_value = int(cell_value, 16)
    return (cell, cell_value)

```

# High-level overlay
If you are more familiar with high-level programming you can notice that we can refer to the uC registers like to the standard array. Why not use this mechanism and override this behavior with our methods that will ask the external device when we are trying to get the value, or send data when we are performing set action.
```python
from .scratch_pad_protocol import ScratchPadProtocol

class ScratchPad:
    def __init__(
        self,
        scratchpad_size: int,
        device_ip: str = None,
        device_port: int = None,
        device_com: int = None,
        device_baudrate: int = None,
    ) -> None:
        self._scratchpad_size = scratchpad_size
        self._link = ScratchPadProtocol(COM=device_com, baud_rate=device_baudrate)
        self._scratchpad_memory = list([0] * self._scratchpad_size)

    def update_scratchpad(self) -> list:
        for i in range(self._scratchpad_size):
            data = self[i]

        return self._scratchpad_memory

    def __str__(self) -> str:
        returned_str = ""
        returned_str += "%-12s%-12s\n" % ("Address", "Value")
        for i in range(self._scratchpad_size):
            returned_str += "%-12i%-12i\n" % (i, self._scratchpad_memory[i])

        return returned_str

    def __getitem__(self, index) -> int:
        data = self._link.read_address(index)
        cell, cell_value = self._link.decode(data)
        self._scratchpad_memory[cell] = cell_value
        return self._scratchpad_memory[index]

    def __setitem__(self, index, value) -> None:
        if value > 255:
            raise ValueError("Higher numbers than 255 cannot be stored in scratchpad.")
        self._scratchpad_memory[index] = value
        self._link.write_address(index + self._scratchpad_size, value)
```

# Testing
Now we are ready to make simple program that will make use of our created classes and test them. Let's perform simple read/write in loop.
```python
import time
from .scratchpad import ScratchPad

scratchpad = ScratchPad(32, 4, 9600)
scratchpad.update_scratchpad()
print(scratchpad)
for i in range(256):
  scratchpad[3] = i
  time.sleep(0.01)
print(f"Value 3:{scratchpad[3]}")
print(f"Value 0:{scratchpad[0]}")
```
We can make it more generic and create simple python package. This thing is beyond of the scope of this tutorial. You can download ready to use package and C code from repo and use it as you want.
After three chapters we have created ready to use protocol that is generic and adding another data to read/store is very simple. For sure there is a lot of methods to improve this code.Therefor the scope of these three articles was to show easy way of getting simple communication between your PC and DIY hardware.By using simple UART - COM converter we interact with our external devices without any extra drivers that we need to develop ourselves from scratch.Now make use of it and create simple data aggregator that read the value from some sensors and stores it in internal registers - create pretty plot by using py-plot!

[GPL_library](https://github.com/MateuszMyalski/GPL)
