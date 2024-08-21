---
title: Configuring openOCD with FTDI JTAG interface
date: 2024-08-19
layout: post
---
# Configuring openOCD with FTDI

The FTDI chips are not only good for transcoding USB/UART transmissions; higher versions extend the feature list to emulate JTAG interfaces. There are many versions of the chip available on the market, but when it comes to the JTAG interface, it all boils down to configuring the ports and setting up the GDB server hosted by software like OpenOCD.

The largest version of the chip is the FT4232H, which allows emulation of up to two JTAG interfaces on the `ADBUS` and `BDBUS` ports. We will use this chip as an example for writing an OpenOCD configuration to utilize one of the JTAG interfaces.

<pre class="ascii center">
+-----+---------+-----------+--------+
| Pin |  Name   | JTAG Port |  MSSE  |
+-----+---------+-----------+--------+
| 16  | ADBUS0  |         0 | TCK    |
| 17  | ADBUS1  |         0 | TDI    |
| 18  | ADBUS2  |         0 | TDO    |
| 19  | ADBUS3  |         0 | TMS    |
+-----+---------+-----------+--------+
| 26  | BDBUS0  |         1 | TCK    |
| 27  | BDBUS1  |         1 | TDI    |
| 28  | BDBUS2  |         1 | TDO    |
| 29  | BDBUS3  |         1 | TMS    |
+-----+---------+-----------+--------+
</pre>

Each port consist four (3 - mandatory, and 1 - optional ) JTAG connectors:

- **TCK** - Test clock 
- **TDI** - Test data input 
- **TDO** - Test data output 
- **TMS** - Test mode select (optional)

The optional **TRST** (test reset) dedicated pin is not supported by the JTAG emulation peripheral. OpenOCD requires to specify the `nTRST` signal to operate correctly, therefore we need to allocate one more GPIO.

> The driver uses a signal abstraction to enable Tcl configuration files to define outputs for one or several FTDI GPIO. These outputs can then be controlled using the ftdi set_signal command. Special signal names are reserved for nTRST, nSRST and LED (for blink) so that they, if defined, will be used for their customary purpose. Inputs can be read using the ftdi get_signal command.

For this purpose we are going to use `ADBUS4` as the `nTRST` signal, and instruct OpenOCD about the reset method by using `reset_config trst_only`.

## Writing the openOCD configuration file

### Defining the FTDI chip
First, OpenOCD needs to be informed that we will use an FTDI chip as the driver for our communication. This is done by setting the `adapter driver` to `ftdi`, resulting in the command `adapter driver ftdi`. Next, we specify the transport layer, which in this case is JTAG, using the command `transport select jtag`. We also need to set the operating speed in kHz with `adapter speed 10000`. If there are issues with connection stability, such as when using long wires, the speed should be decreased. Lastly, before we move on to pin configuration, we need to specify the VID (Vendor ID) and PID (Product ID) of the FTDI chip, which can be found in the datasheet for the part. The documentation provides the following statement:

> If no EEPROM is connected (or the EEPROM is blank), the FT4232H uses its built-in default VID (0403), PID (6011) Product Description and Power Descriptor Value. In this case, the device will not have a serial number as part of the USB descriptor.

Basing on that we can specify the FTDI VID and PID with `ftdi_vid_pid <VID> <PID>`.

### Defining used JTAG peripheral
The configuration needs to be aware which JTAG peripheral available on the FTDI chip supposed to be used by the session. In FT4232H we have two possibilities, either port 0 or 1. We can select the port with `ftdi_channel <port>`. In case FTDI with only one JTAG is used this configuration is not necessary.

### Configuring pins
To configure the GPIO pin direction, OpenOCD uses the `ftdi_layout_init` and `ftdi_layout_signal` functions.

First, we define the direction of the pins on the port using `ftdi_layout_init`, where `1` means output and `0` means input. We also need to define the default state as the second argument. All port pins will be set to low, except for **TMS**, which will be set to high. This results in the configuration line:

```text
ftdi_layout_init 0xfb 0x08
```

It's also important to define the `nTRST` signal, which is used to trigger the device reset. To instruct OpenOCD where to find the signal, we use `ftdi_layout_signal`. We need to specify the name of the signal, mask for the data bit, and enable open collector mode for the pin.

The `nTRST` signal will use `ADBUS4`, which translates to the mask `0x0010` (the mask accounts for all available ports). The open collector output type will be the same as the data mask. This results in the following command:

```text
ftdi_layout_signal nTRST -data 0x0010 -oe 0x0010
```

To make this clearer, we can construct a diagram of used masks.

<pre class="ascii center">
Pin name  | ADBUS7 | ADBUS6 | ADBUS5 | ADBUS4 | ADBUS3 | ADBUS2 | ADBUS1 | ADBUS0 | Mask
Direction |  OUT 1 |  OUT 1 |  OUT 1 |  OUT 1 |  IN  0 |  OUT 1 |  OUT 1 |  OUT 1 | 0xfb
State     |      0 |      0 |      0 |      0 |      1 |      0 |      0 |      0 | 0x08
Data      |      0 |      0 |      0 |      1 |      0 |      0 |      0 |      0 | 0x0010
OC En.    |      0 |      0 |      0 |      1 |      0 |      0 |      0 |      0 | 0x0010
</pre>

## Final configuration for FTDI
To conclude all necessary configuration that must be added to the openOCD config files we end up with example script:

```text
adapter driver ftdi
transport select jtag
adapter speed 10000
ftdi_vid_pid 0x0403 0x6011
ftdi_channel 0
ftdi_layout_init 0xfb 0x08
ftdi_layout_signal nTRST -data 0x0010 -oe 0x0010
reset_config trst_only
```

Finally, you must add all configuration related to the MCU architecture that is going to be used.

# Sources

1. [FT4232H - Datasheet](https://ftdichip.com/wp-content/uploads/2020/08/DS_FT4232H.pdf)
2. [OpenOCD Debug Adapter Configuration - Manual](https://openocd.org/doc/html/Debug-Adapter-Configuration.html)
3. [STMicroelectronics OpenOCD - examples](https://github.com/STMicroelectronics/OpenOCD/tree/openocd-cubeide-r6/tcl/interface/ftdi) 