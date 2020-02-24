# Set up

## What you need

- Working unix (Linux / Mac / BSD / Solaris) machine
- micro SD card with at least 4GB of space
- USB stick with at least 4GB of space
- Raspberry Pi 3B+ or higher
- [Latest Raspbian Lite ISO](https://www.raspberrypi.org/downloads/raspbian/)
- (Optionally) Second screen

## Installation of Raspbian

Install Raspbian Lite like any other Linux distribution.

```
dd if=raspbian-lite.iso of=/dev/mmcblk0 status=progress bs=8M
```

## Getting a graphical user interface

Start up the RPi with the Raspbian image and wait for the set up screen to
finish. Then, in the configuration manager, set up auto login via commandline.
If you can, set up WiFi in there as well. LAN will work too.

Install some packages. The following will be needed.

```
sudo apt-get update && sudo apt-get install xorg i3 yarnpkg git
```

Clone this repository in your home directory on your RPi.

```
git clone https://github.com/leonardlorenz/raspiashow ~/raspiashow
```

Run the install script. It will install the i3 configuration and set up your
.bash_profile to start i3 at boot.

```
~/raspiashow/install.sh
```

Reboot your RPi.

```
sudo reboot
```
