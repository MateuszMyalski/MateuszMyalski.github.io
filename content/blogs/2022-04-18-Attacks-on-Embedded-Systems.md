---
layout: post
title: Attacks on Embedded Systems
date: 2022-04-18
---
# Attacks on Embedded Systems
When it comes to analyzing attack vectors on Embedded System, we have many potential ways of creating the vulnerability during designing the software. 
Therefore, it is worth to review the design and later the code for known potential issues that can be exploited by the attackers. It is also extremely important to remember, that usually the attack vectors can be performed on broad scale, starting from analyzing the physical connection on the electronic circuits, finishing on data tampering. Developers and hardware engineers, need to take into account, that all external opened interfaces and not secured via hardware and software are entry points for attacks and will be used to infiltrate the device flow.

This paper combine described problems and solutions, found in many publications and studies. Understanding the scale of potential security issues can help during designing and decision-making while designing new features/systems. Moreover, knowledge about such concerns helps engineers and developers while code reviews. Being sane about how easily is to open another path for exploit is valuable nowadays, especially that the high-tech technology used for hacking is commonly available.

# Architectural model
During designing software, especially embedded software – that interact with physical structures installed on the board, is necessary to organize all assets flow. Understanding and presenting it on diagram flow helps investigate potential security flaws. The whole system should be divided into “trust regions” and take under consideration any possible vector attacks during the data transmission. Therefor, it is useful to prepare clear documentation how data is protected during the data exchange.

Data flow can be separated into:

- internal flow – inside in integrated circuit,
- middleware flow – between other integrated circuits (e.g. SoC  and external flash),
- external flow – between the device and other device/cloud.

Each data flow subject to different vector attacks, therefore certain methods of securing the information can be used. 
When it comes to embedded system software, the energy, and time consumption must be taken under consideration. Current trend for IoT devices pushes the architects and security engineers to the limits, because such devices are exposed to all listed scenarios.

The architectural model should represent a graph containing used APIs, libraries, memory regions, used peripherals, buses, devices. Moreover, all blocks should be logically grouped and potential security issues, mitigation should be noted down for next step. All security boundaries should be highlighted to be taken under consideration when threat model is going to be formalized. 

The finished architectural model should also contain table of important assets/data types, data descriptions, data flow graph and used methods of security to keep assets secure. 

# Threat model
The threat model kept updated allows to judge the risk of implemented features and allows planning future changes in the hardware/software. To create the threat model, architects, and security engineers should discuss all possibilities that can be used to perform attacks. Found threats should be classified and described with the potential mitigation. Analyzing the attack vectors can give a wider image of how the device can be exposed to the STRIDE model.

> STRIDE model – Spoofing, Tampering, Repudiation Information Disclosure, Denial of service, Elevation of privilege

By examining the finished threat model, questions for future security development should be answered. The significant part of this task is to organize the knowledge of possible vector attacks and the device architecture.

# Common attack vectors
## The main groups
- Side-channel attacks.
- Data tampering.
- Injecting malicious code.
- Interface sniffing.
- Program flow change.
- Side-channel attacks.

## Methods
- *Timing analysis* – based on the correlation of output data timing behavior and input.
- *Power analysis* – perform power usage analysis, data lines sniffing. This kind of attack should give the attacker information about critical paths executed during the run time. In e.g. the attacker can try to check how long cryptography operations takes vs supplied key/signature. By analyzing the timings and power consumption, the attacker tries to perform operations on the input data to move the crypto-operation to execute longer. “Different key bit values cause different execution time, which makes a readout and reconstruction of the key possible.”
- Electromagnetic analysis.
- Fault analysis.
- *Glitch analysis* – the attacks are based on introducing clock glitches into the device clock source. Such glitches are supposed to trick the hardware and increment the program counter multiple times to skip instructions. This attack vector can be used to skip the verification process that is based on simple one 'if' statement.
- *Micro-probing* – basically similar to *power analysis* with the difference this is executed on the scalped chip traces. 
-  *Return-into-libc* - attack allows performing malicious tasks by manipulating the return addresses to point to other libc functions. By utilizing already compiled in code, the attacker can build-up the code without injection extra code into the memory.
- *Pointer subterfuge*:
	- *Function pointer clobbering* – modify the function pointer, this way the attacker can change the called function. 
	- *Data pointer manipulation* – the pointer that points to the data storage is changed, so the program is no more accessing valid data.
	- *Exception handler hijacking* – modifies the thread environment block. This pointer points to the list of registered thread exception handler functions.
	- *Virtual pointer smashing* – replace the virtual function table. This attack vector is mostly used when using C++ instead of pure C language. The attacker replace the virtual function pointers with malicious ones, so the class is calling attacker's code instead the original code.
- *Time-of-use Time-of-check(TOC)* - the attacker uses the resources in moments when they are during state transitions. In the simple scenario, assume that the data is kept on the memory and is being verified before executing in parts. When the nth part has been verified correctly, and the n+1 part is being currently during check, the attacker can tamper the nth block and in e.g. overwrite the data.
- *Run vulnerable version of the software* – devices often allows updating the firmware. Critical security issues in software that must be patched as soon as possible. In case of huge security gap in older software already published, the attacker has open doors for exploiting such error.

# Defensive strategies and methods
In most cases, mitigating attack vectors by implementing secure mechanisms in the software is a double-edge sword. Software implementations bring new possible attack vectors and optimizations penalties. So far, the chip market has enrolled much hardware security accelerators. Since the IoT era has come to our daily life, vendors faced the occurring problems. The answer is security dedicated chips and SoC in-build security mechanism implementations.

When we speak about the security, we cannot narrow the topic to only cryptographic context. Attackers have physical access to devices and are able to use professional equipment to hack them. Due to bad architecture, such attacks, can end up a large scale financial hit to companies. Therefore, it is important to look not only at the encryption complexity used during data exchange, but also at the device architecture and security processes that are executed by 2P and 3P vendors.

## Anti-Clock glitching mechanism
(Proposition by Cinmay Deshpande.) By utilizing another source of the oscillations in e.g. Ring Oscillators, it is possible to monitor any clock anomalies and correct them. The extra clock source is build inside the device and immune to the external clock manipulations.
It is also possible to protect the code by multiple checks of the same values during critical branching operations. Then, even after clock glitch the code will need to repeat the operation. Such features are available in the compilers.

In GCC look for: `-fharden-compares`

## EM (electromagnetic) glitch detecting
To detect any electromagnetic attacks or even natural behavior caused by the Sun, multiple checks of the same algorithms are taken into account while making decisions by the software/hardware. The simplest mechanisms to detect EM glitches is to shadow digital blocks and compare the output of both calculations. Such operations can be performed in parallel, and the only latency is taken while comparing outputted data. The counter measurement is the power consumption of such mechanisms. Multiplying operational blocks, costs more current to take by the device to perform one task.

## Return Address Defender (RAD) - Stack Guard
As known, the return addresses are placed on the stack when calling another functions. Simple buffer overflows can easily modify the data stored on the stack, what leads to potential malicious code injection attacks. Such overflows can be detected by using "Stack Guard" (canary words) that are placed above the stack and check by the system. In case known words modification by the buffer overflow, this is a sign that the data can be potentially tampered. The check should be performed every time the function returns.

In GCC look for: `-fstack-protector`, `-fcf-protection=[full|branch|return|none|check]`

For detecting vtable errors:

In GCC look for: `-fvtable-verify=[std|preinit|none]`

## RAD - Stack Shield
Return address are copied multiple times to the data region when the function starts. When the function exit, the return address is being compared with the copies stored in the memory.

In GCC look for: `-fsanitize=shadow-call-stack`
![Stack Shield](images/attacks_on_embedded_systems/stack_shield.png)

## Return Address Repository (RAR)
The RAR technique is similar as Stack Shield method to protect the buffer overflow. The main difference is that the return addresses are stored in separate memory region together with canary words, and mine zones with read only attribute. The following combination protects the repository from overflows and brute-force attacks by trying to invalidate the return addresses. When the attacker by mistake modify the RO (Read-Only) region or canary word, the device is going to execute critical failure handler.
![RAR](images/attacks_on_embedded_systems/RAR.png)

## Secure Return Address Stack (SRAS)
Code injections are mostly done by manipulating return pointers stored on the stack. To mitigate such possibility, the hardware can implement secure stack that allows to keep copy of each return pointers and during the runtime. Before the CPU returns to the caller function, the return pointer can be compared with its copy in stored in the other memory region. This solution can be expanded to implement: *control stack* - keeps return addresses and *data stack* - holds data. Such mechanism can limit the problem of buffer overflows.
![SRAS](images/attacks_on_embedded_systems/SRAS.png)

## Point Guard
Pointers can be changed during runtime by the attackers. The smallest address change can have big impact on the program flows. By generating a unique key for each process, the pointers can be XORed or encrypted using different methods, so attackers will not easily reconstruct the used memory address. Therefore, manipulating such pointers will probably cause hard faults.

## Out-of-bound pointers checks
Before using the pointer by the machine some predefined operations are performed on the pointers to check if they are pointing to the same address. 
In GCC look for: `-fsanitize=hwaddress`

## Library safe functions
Operating on raw strings can lead to easy overflows, when the string is not properly null-terminated or the buffer is too small to store the incoming data. The safe functions of std library should be used to handle such cases. In e.g. `strcpy -> strncpy`, `strcat -> strncat`.

## Control Flow Checks
To check the program flow during run time we can implement manual software checks, use compiler features to protect the flow manipulation or use hardware acceleration for checking the code block validity during the runtime.

Simple flow control checks performed by software can be implemented as periodic counter or flags checks. The software should have prepared clear flow and already defined tasks ID. Such generated LUTs can be then imported into the code and checked by special assertions if the flow is valid.

Next possibility is to generate special keys for each code block and check the code validity during run time, this gives the possibility to ensure that the code has not been tampered. This is called *Control Flow Integrity Checks*.

Another way of validating flow of the program is to track the jump, return and branching instructions. Such idea generates a possible jump table that is compared when any jump is executed. The implementation can be purely done manually in the software or compiler’s options can be used. 

In GCC look for: `-fcf-protection=[full|branch|return|none|check]`

## Trustzone
The ARM introduced new idea of splitting the memory and peripherals access for secure and insecure software. Such mechanism is transparent for developers. The basic usage of such feature is to load known and verified software to the secure part of the memory and load other binaries into the not secure fragments. This way, it is possible to block access to other parts of the memory or peripherals and enforce it by hardware. Isolating potentially dangerous software from the other chip parts, disallows an attacker to interact with on-chip structures and perform R/W operations on secured memory.
The interaction between non-secure regions and secure regions can be only done via “legalized” API.

## TOC
Resources that can be potentially exploited with such attack vector should be locked during the time they are processed. The lock mechanism can be implemented by moving/copying the resources to the safe memory regions, using spinlocks or disallowing any access for third party software. 

## Anti-rollback
To disallow to flash the device with older version of the software, the versioning system must be introduced. Different strategies give more freedom when it comes to publishing the firmware. In e.g. every major version can fix potential security gaps. This means, that older major versions cannot be executed on the device. In the other hand, the device must implement a secure way of storing current version of installed software. Data that contains version information can be stored in FLASH memory with proper signature and encryption, or even better, stored in *One-Time-Programmable (OTP)* registers.

# Code quality
Probably every device, that is meant to be certified by the security team, sooner or later will need proper code review. The code base need to be checked in few aspects before it can be approved to start the manufacturing process of the device. Therefore, it is important to **clearly state** the code standards, that will be enforced by automatic checkers.

Not only code standard is the foundation, but also industry standard should be selected. Depending on the type of end product – automotive/IoT/medical etc. – some decision should be taken. Currently, the popularity is taken by MISRA-C standard that defines multiple rules and checks that need to be taken under consideration while committing the source code to the mainline. Another, less strict standard is BARR-C that is taking its roots from the MISRA-C. The difference is how strict standards are and how much freedom it gives to developers.

Not only coding standards are the fundamental things when it comes to security. Preparing good pipelines with sanity checkers and static code analysis is the key for safe and fast development. During code reviews, reviewers should not be focusing on every pointer manipulation, since it is rather impossible to track every pointer value by the human. It is common to use **ASAN**, **VALGRIND**, **LLVM**, **SonarQube**, **Clang-tidy** to automatize sanity and code style checks.
Implementing security features often comes with performance penalties, for the client sake and product quality it is recommended to track how extra clock cycles a certain feature adds to the execution time. Sometimes it is worth to give the decision if new introduced mechanics should be on or off for the client.

# Summary
The above considerations, about the embedded system security designs and techniques, should allow developers to understand the very basics of security certification processes. Every touched attack vectors and possible mitigation, barely scratches the amount of knowledge gathered by specialists in these topics. Therefore, it is highly suggested to deepen the knowledge that is shared in books, documents, blogs, articles and meet-ups.

# References 
These notes have been written with help of the following sources:

1. [Security in Embedded Hardware - Daniel Ziener - Computer Architecture for Embedded Systems University of Twente](https://ris.utwente.nl/ws/portalfiles/portal/89170348/)
2. [Embedded Application Security Best Practices - OWASP](https://scriptingxss.gitbook.io/embedded-appsec-best-practices/)
3. [Fault Injection using Crowbars on Embedded Systems - Colin O’Flynn](https://eprint.iacr.org/2016/810.pdf)
4. [Hardware Fault Attack Detection Methods for Secure Embedded Systems - Chinmay Deshpande](https://vtechworks.lib.vt.edu/bitstream/handle/10919/82141/Deshpande_CR_T_2018.pdf?sequence=1&isAllowed=y)
5. [Guide to C stdlib functions - Steve Choi](https://web.stanford.edu/class/archive/cs/cs107/cs107.1212/guide/stdlib.html)
6. [GCC Program Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)
7. [BARR-C Standard](https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard)
