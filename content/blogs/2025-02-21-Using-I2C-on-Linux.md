---
title: Using I2C on Linux
date: 2025-02-21
layout: post
category: linux
---
# Using I2C on Linux

## Linux pseudofiles
The Linux system abstracts the hardware layer from the OS by treating everything as a file. When working with single-board computers like the Raspberry Pi, you can easily write drivers directly in userspace without needing to implement complex kernel drivers. One example is the I2C bus interface available on one of its pins. The Raspberry Pi ecosystem offers several libraries that help you interact with I2C, but this article will show you how to use the native API to utilize this interface.

Before writing any code, make sure you have enabled access to your hardware interface using the `raspi-config` tool. To do this, enter `raspi-config` in the CLI, navigate to `Interface Options`, and select `I2C` to enable access to the hardware interface. Probably the board will need to reboot.

If you do everything correctly you should be able to see I2C-* folders in the following directory `/dev/i2c-`.

## Linux API
The I2C interface from the user perspective is a simple file, which can be opened. The file handler allows to use `ioctl` function to configure the interface parameters. According to the [kernel documentation](https://www.kernel.org/doc/html/v5.4/i2c/dev-interface.html) following settings importnat for the basic usage can be used set:

- `I2C_SLAVE` - sets the target device to work as slave,
- `I2C_TENBIT` - sets the address bit size to 10-bits instead default 7-bits.

*This article ommits the exesitence of SMBus features.*

The I2C interface works with standard `read` and `write` function calls without any additional complexity.

## I2C Read & Write
Include necessary header files to work with file descriptors:

```c
#include <stdint.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/i2c-dev.h>
```

To select the I2C interface open the file descriptor with attributes for reading and wrritting:

```c
int i2c = open("/dev/i2c-1", O_RDWR);
if (i2c < 0) {
    exit(1);
}
```

To communicate with the typical I2C device which is going to work as slave, use `ioctl` function to define its hardware address. Since the hardware address is 7-bit and the typical address in datasheets are expressed as 8-bit byte, the address must be shifted one place to the right. In example when the 8-bit hardware address is `0xBF`, the 7-bit address will be `0x5F`. The R/W bit is going to set automatically by the Linux's driver.

```c
if (ioctl(i2c, I2C_SLAVE, (0xBF >> 1)) < 0) {
    close(i2c);
    exit(1);
}
```

Now you can construct two atomical functions that will help you sending one byte to the device, and reading one byte.

```c
uint8_t rx_byte(int i2c_fd, uint8_t addr) {
    uint8_t rx;

    // Write the register address
    if (write(i2c_fd, addr, 1) != 1) {
        close(i2c_fd);
        exit(1);
    }

    // Read the data from the register
    if (read(i2c_fd, rx, 1) != 1) {
        close(i2c_fd);
        exit(1);
    }

    return buf[0];
}

uint8_t tx_byte(int i2c_fd, uint8_t addr, uint8_t data) {
    uint8_t buffer[2];
    buffer[0] = addr;
    buffer[1] = data;

    // Write the address and data
    if (write(i2c_fd, buffer, sizeof(buffer)) != 2) {
        close(i2c_fd);
        exit(1);
    }

    return 0;
}
```

Using these two functions, you will be able to create higher abstraction layers to help you configure the I2C device.

### i2c-tools

For debuging purposes the Linux communicty created I2C tools that helps you to communicate with the interface directly through the bash. To install those use `sudo apt-get install i2c-tools`. This will enable I2C tools to scan the I2C bus for any device online `i2cdetect -l 1` (here command is listining all devices on interface i2c-1). Next, by using `i2cget` you can issue a read/write operation directly on the I/Os `i2cget 1 0x5f 0x0f b` - the command will use `i2c-1` interface and read single byte (`b`) from device which hardware address is `0x5f` (remember about 8-bit to 7-bit transformation) from memory address `0x0f`.

The `i2cget` command can be substituted with C code using presented code in previous chapter:

```c
int i2c = open("/dev/i2c-1", O_RDWR);
ioctl(i2c, I2C_SLAVE, (0xBF >> 1));
uint8_t rx = rx_byte(i2c, 0x0f);
close(i2c);
```