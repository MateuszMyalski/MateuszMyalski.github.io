---
layout: post
title: STM development on linux
date: 2022-07-03
category: Tutorials
tags: embedded, linux
---
# STM development on linux
## Introduction
Setting up a development environment can be time-consuming especially, when working with new platforms. During my hobby projects, I always struggled to find easy to follow how-to prepare full standalone environment for STM32. I am not big fan to work with all the regenerated project structures like PlatformIO, CubeMX or Arduino. When I am working on my hobby projects, I would like to go over difficulties that can teach me something new.

This small article presents how to create a simple standalone working environment for STM32 development.

## Installing the compiler
Arm-none-eabi compiler: [Downloads | GNU Arm Embedded Toolchain Downloads – Arm Developer](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)    

To make this compiler available everywhere, add the `gcc-arm-none-eabi/bin` directory to the `PATH` env. variable. To use it in Makefiles only use `gcc-arm-none-eabi/bin` path in variable.

## Installing the programmer

1.  Download Linux files of [STM32CubeProg - STMicroelectronics](https://www.st.com/en/development-tools/stm32cubeprog.html).
2.  Install STM32CubeProgrammer.
3.  Execute install STM32CubeProgrammer file.
4.  After unpacking the STM32CubeProgrammer, add `Cube Programmer`  libraries to your .bashrc file. `export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$HOME/STMicroelectronics/STM32Cube/STM32CubeProgrammer/lib/`
5.  Give permission to libUSB by: `cd <INSTALATION_PATH>/STMicroelectronics/STM32Cube/STM32CubeProgrammer/Drivers/rules/
sudo cp .* /etc/udev/rules.d`

## Installing the stlink-gdb
It is possible to use OpenOCD to connect to the target board. However, the problem is that not always the newest platforms are already in the config files. The stlink-gdb server is always ready to work with your platform and most of the GDB configs are done for the developers. This usually the most frustrating thing when starting the debugger – configuring it.

Unfortunately, the ST does not give easy way of downloading JUST the stling-gdb server. Instead, it is needed to download the CubeIDE and take the binary from it.

1. Download CubeIDE [STM32CubeIDE - STMicroelectronics](https://www.st.com/en/development-tools/stm32cubeide.html)  
2. Unzip the file.
3. Extract Makefiles and go to plugins.
```bash
unzip en.st-stm32cubeide*
bash st-stm32cubeide* --noexec 
cd st-stm32cubeide*.root 
tar xvzf st-stm32cubeide*.tar.gz 
cd plugins
```
4. Find folder named `com.st.stm32cube.ide.mcu.externaltools.stlink-gdb-server.*`
5. Copy its tools folder to the `<INSTALATION_PATH>/STMicroelectronics/STLink-GDB-Server`  
6. Create config file in `<INSTALATION_PATH>/STMicroelectronics/STLink-GDB-Server/bin/config.txt`
```bash
#-e: Enables persistant mode
-e

#-f <Log-File>: Name of log file. Please make sure
#               that directory not is write protected.
-f debug.log

#-p <Port-Number>: TCP-Listen Port-Number.
-p 3333

#-r <delay-sec>: Maximum Delay in status refresh
-r 15

#-d: Enables SWD mode
-d

#-t: Shared mode using ST-LINK server
-t

#-cp <path>: Path to STM32CubeProgrammer
#          Modify to correct path
#          for STM32_Programmer_CLI executable
-cp ../../STM32Cube/STM32CubeProgrammer/bin/
```
7. Create script `stlink-gdb-server.sh`
	```bash
	#!/bin/bash 
	cd <INSTALLATION_PATH>/STMicroelectronics/STLink-GDB-Server/bin 
	bash ST-LINK_gdbserver.sh
	```
8. Add `chmod` on the `stlink-gdb-server.sh` and copy in into the `/usr/bin` directory
	```bash
	chmod +x stlink-gdb-server.sh
	mv stlink-gdb-server.sh /usr/bin
	```

### Installing other useful tools

## Minicom - serial terminal
Simple CLI based serial terminal. Easy to navigate and to use.
```bash
sudo apt install minicom
```

## Saleae - logic analyzer software
I like to use Saleae logic analyzer. They are also supplying pretty nice software to interact with their devices. Not only the original devices uses them also this [Chainees Logic Analyzer](https://www.az-delivery.de/products/saleae-logic-analyzer). 

To download SW: [Logic analyzer software from Saleae](https://www.saleae.com/downloads/)

## ST-LINK server

1. Download the [ST-LINK-SERVER - STMicroelectronics](https://www.st.com/en/development-tools/st-link-server.html)
2. Unpack the folder  .
3. Execute:
```bash
sudo dpkg -i st-stlink-server-xxxx-linux-amd64.deb
```
4. To run - execute `stlink-server`.

# How to use tools
## Running the GDB

1.  Connect ST-Link.
2.  Execute `stlink-gdb-server`.
3.  Execute the GDB `arm-none-eabi-gdb`.
4.  In GDB run
```bash
target extended-remote localhost:3333
file <PATH_TO_ELF>
b main
continue
```

## Programming from CLI
The `CubeProgrammer` must be installed, then execute:
```bash
<CUBE_PROGRAMMER_BIN_PATH>/STM32_Programmer.sh \
	-c port=SWD freq=4000 \
	-w <OUT_PATH>/<APP_NAME>.hex 0x08000000 \
	-s
```

# VSCode
## GDB interaction
Create `launch.json` with content:
```json
{
    "configurations": [
    {
        "name": "(gdb) Launch",
        "type": "cppdbg",
        "request": "launch",
        "program": "<PATH_TO_APP>.elf",
        "miDebuggerPath": "<TOOLCHAIN_PATH>/gcc-arm-none-eabi/bin/arm-none-eabi-gdb",
        "miDebuggerServerAddress": "localhost:3333",
        "MIMode": "gdb",
        "cwd": ".",
        "setupCommands": [
            {
                "description": "Enable pretty-printing for gdb",
                "text": "-enable-pretty-printing",
                "ignoreFailures": true
            }
        ]
    }
    ]
}
```

To run the debbuging session, first execute in the terminal `stlink-gdb-server.sh`, and launch debugging from the VSCode.

## Project rebuild
Tasks in VSCode can be really helpful, the most basic ones are to run `make` commands by pressing `CTRL+B` or selecting it with `CTRL+SHIFT+B`.
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build project",
            "type": "shell",
            "group": "build",
            "command": "make all"
        },
        {
            "label": "Clean project",
            "type": "shell",
            "group": "build",
            "command": "make clean"
        },
        {
            "label": "Info project",
            "type": "shell",
            "group": "build",
            "command": "make info"
        },
    ]
}
```

## Auto-flashing
Being able to flash the .hex file into the target via simple click is way easier than going through GUI interface. It is possible to automate the procedure with simple task.
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Upload binary",
            "type": "shell",
            "group": "none",
            "command": "<PATH_TO_PROGRAMMER>",
            "problemMatcher": []
        }
	]
}
```
Path to programmer:
```bash
<INSTALL_PATH>/STMicroelectronics/STM32Cube/STM32CubeProgrammer/bin/STM32_Programmer.sh \
	-c port=SWD freq=4000 \
	-w <PATH_TO_APP>.hex 0x08000000 \
	-s
```

# Troubleshooting
## GDB needs ncurses
Missing `ncurses` when running GDB?
Run:
```bash
sudo apt-get install libncurses5 libncurses5:i386
```

## References
- [STM32CubeIDE programmer and ST-LINK GDB server on Linux](http://pacinispace.blogspot.com/2020/02/stm32cubeide-st-link-gdb-server-on-linux.html)