---
title: Post configuration for minimal debian installation
date: 2024-01-31
layout: post
---
# Post configuration for minimal debian installation
As I transitioned to Debian with a minimal installation paired with the XFCE desktop environment, I realized the importance of enhancing my system for a more comprehensive user experience. While the initial minimal setup laid the foundation, I found it necessary to install additional packages to fine-tune and optimize my Debian environment. This collection of notes not only serves as a guide to replicate my current configuration but also acts as a reference for future improvements. The integration of XFCE, along with carefully chosen packages, strikes a balance between efficiency and functionality, ensuring a smooth and personalized Debian experience. I created some notes that gets into essential packages and configurations, making it a handy resource for anyone seeking to configure Debian with XFCE at an intermediate to advanced level of proficiency.

**Disclaimer: The following packages are customized to my taste. Feel free, and encouraged, to adjust them to your preferences.**

## 1. Installing XFCE Desktop Environment
Once you complete the Debian installation from your USB/CD without selecting any desktop environment, you will need to configure it yourself. Start by installing the essential components for a minimal XFCE desktop environment. Open a terminal and execute:

```bash
sudo apt install xfce4-power-manager xinit nm-applet network-manager-gnome thunar xfce4-session xfce4-settings xfconf xfdesktop4 xfwm4 rxvt-unicode git make rofi
```
- `xfce4-power-manager` - It also allows users to control the display backlight brightness and set power-saving modes for displays and monitors.
- `xinit` - X display server.
- `nm-applet` - Provides detection and configuration for systems to automatically connect to networks. 
- `network-manager-gnome` - GUI application for displaying tray icon and manage connections.
- `Thunar` - Thunar provides a user-friendly interface for managing files and directories, with features like tabbed browsing, bulk renaming, and file previews. It is the default GUI file manager for XFCE
- `xfce4-session` - Manages the user sessions, handling the startup and termination of applications and managing the overall session settings.
- `xfce4-settings` - Allows users to configure various settings for the XFCE desktop environment, including display, keyboard, mouse, and more.
- `xfconf` - Stores and retrieves application configuration settings. It is a key-value configuration system used by various XFCE components.
- `xfdesktop` - Manages the desktop background, icons, and provides basic desktop management functions.
- `xfwm4` - Manages window placement, decorations, and handles basic window management functions within the XFCE desktop environment.
- `rxvt-unicode` - Provides a lightweight terminal emulator with support for Unicode, suitable for use within the XFCE environment.
- `git` - Version control software.
- `make` - Unix build system tool.
- `rofi` - Application launcher.

These packages collectively form the core components necessary for a functional and lightweight XFCE desktop environment on a Debian system. They handle various aspects of the desktop user experience, ranging from file management to window handling and configuration settings.

## 2. Granting Sudo Access
I discovered that my created profile is not part of the `sudoers` group, preventing me from using any other commands relevant to the `root` user for further configurations.

```bash
su -
usermod -aG sudo <username>
```

## 3. Configuring existing SSH keys
I typically store my private keys in a secure location, ensuring continued access when switching systems by creating backups. Place your private keys in the `~/.ssh` directory. If you haven't used the default names (`id_rsa`), remember to add them manually after each reboot, or include them in your `.bashrc` for automatic loading.

```bash
ssh-add ~/.ssh/<key>
```

Usually when ou create the file by yourself, the chmod permissions are set to 644, this is too wide from private key. Change it to 600.

```bash
chmod 600 id_rsa
```

## 4. GUI WiFi Manager
If you configured your WiFi during installation, you likely have internet access. However, changing connection settings currently requires using command-line commands, which may not be convenient if done infrequently. XFCE includes `nm-applet`, a tool that simplifies network configuration. Unfortunately, I encountered issues enabling it, necessitating manual editing of the Network Manager configuration.

Begin by removing your previously configured network from `/etc/network/interfaces`.
You wil find  something similar:

```
# The primary network interface
allow-hotplug wlp0s20f3
iface wlp0s20f3 inet dhcp
	wpa-ssid wifi-name
	wpa-psk  wifi-password
```

Subsequently, modify the `/etc/NetworkManager/NetworkManager.conf` file to set it as 'managed':

```
[main]
plugins=ifupdown,keyfile

[ifupdown]
managed=true
```

Reboot the system.

## 5. Audio Manager
To commence listening to audio, it is essential to install the basic packages enabling configuration of sound input and output. I recommend using `pulseaudio` as it usually suffices for this purpose and `xfce4-pulseaudio-plugin` for displaying the tray icon.

```bash
sudo apt install pulseaudio xfce4-pulseaudio-plugin
```

## 6. Bluetooth Manager
I typically use my AirPods with the Linux system. The Bluetooth manager is not included by default in the minimal installation. To set it up, you need to download `blueman` or any other GUI manager. Alternatively, if you prefer, you can stick to the command line (CLI). 😊

```bash
sudo apt install bluetooth pulseaudio-module-bluetooth blueman
```
- `bluetooth` - Essential Bluetooth utilities and tools for managing Bluetooth devices.
- `pulseaudio-module-bluetooth` - PulseAudio extension module enabling seamless integration of Bluetooth audio devices.
- `blueman` - GTK-based Bluetooth manager with a user-friendly graphical interface.

## 7. Touchpad click
Since I use a laptop for my daily activities, I am accustomed to using touchpad taps to click on items. To enable this functionality, you need to add a few configurations.

based on this [thread](https://unix.stackexchange.com/questions/337008/activate-tap-to-click-on-touchpad).
In the file `/etc/X11/xorg.conf.d/40-libinput.conf` add
```
Section "InputClass"
        Identifier "touchpad catchall"
        Driver "synaptics"
        MatchIsTouchpad "on"
        Option "TapButton1" "1"
        Option "TapButton2" "3"
```

Reboot the system.

## 8. The keyring
When attempting to log in to my GitHub account to sync settings on VSCode, I encountered an error related to the keyring application. It appears that XFCE lacks a dedicated tool to store secrets on the device. A possible solution is to reuse one from GNOME.

```bash
sudo apt install gnome-keyring
```

### Keyring prompt
If you set up a password for the keyring, you will be prompted to enter it every time you restart the machine. There's a suggestion [here](https://unix.stackexchange.com/questions/324843/chrome-harasses-me-for-a-keychain-password-at-startup) to set them blank. While it may not sound ideal, it is a workaround for the issue.

## 9. Snap store
I enjoy installing a few apps from the Snap Store, which are not available by default. To install them:

```
sudo apt install snapd
sudo snap install core
sudo snap install snap-store
```

### Making snap applications visible for the system
To achieve this, simply add symbolic links to the applications.

```bash
ln -s /var/lib/snapd/desktop/ ~/.local/share/applications/
```

## 10. Emojis
When I started browsing the internet, I noticed that some emojis were not displaying correctly; instead, I saw black blocks. This issue can be resolved by downloading the `noto-color-emoji` fonts.

```bash
sudo apt install fonts-noto-color-emoji
```

