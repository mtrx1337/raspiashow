# Set up

## What you need

- Working unix (Linux / Mac / BSD / Solaris) machine
- Gparted
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

## Booting the root partition from a USB stick

... to prevent premature wear of the SD card.

Start up the RPi with the Raspbian image and wait for the set up screen to
finish. 
In the configuration manager, set up auto login via commandline.
If you can, set up WiFi in there as well. LAN will work too.
    
Now after we set this up, power off your RPi and stick the SD card back into
your computer. To make sure we don't lose something in the process, let's
copy our current root directory to our harddrive first.

On your computer, do
```
sudo dd if=/dev/mmcblk0p2 of=~/root-backup.img status=progress bs=8M
```

Now stick in your USB stick and open up Gparted. Navigate to your USB stick,
then create a new GPT partition table (right side in the menu bar at the top).
This will erase any partitions and data, so be careful about what is on the stick.
Create a new EXT4 partition with the (optional) "ROOT" label. Apply your
new changes in Gparted at the top.

Since we now have an empty root partition we can use, we will write the root image
to that.

```
sudo dd if=~/root-backup.img of=/dev/sdX1 status=progress bs=8M
# where X is your usb stick's drive letter.
# Make sure not to select sda1 or bad things will happen.
# You can find the drive letter in Gparted if you're not sure.
```

Now we tell Raspbian to boot from the USB stick. To do that we must
Mount the boot partition of the SD card to somewhere we can edit it.

```
sudo mkdir /mnt/mmc-boot
sudo mount /dev/mmcblk0p1 /mnt/mmc-boot
```

Edit the cmdline.txt in it. Use whatever text editor you want, I prefer neovim.
Replace whatever `root=` said before with `root=/dev/sda1` and save the file.

```
sudo nvim /mnt/mmc-boot/cmdline.txt
```

### Additional notes

Sometimes Raspbian creates black borders around your screen. If you want to prevent
this you can edit /boot/config.txt later and uncomment `disable_overscan=1`

## Getting a graphical user interface

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

You need to configure the `RASPIASHOW_CONFIG_URL` environment variable to let raspiashow
know where to download the configuration file from.

You can set it for one-time-use via

```
export RASPIASHOW_CONFIG_URL=https://my.domain.tld/configuration.json
```

The best way to set this permanently would be inside the `~/.bash_profile`.
Just stick the line from above at the top of the file.

Reboot your RPi. If your configuration file is valid, it should start up
a chromium instance displaying whatever you configured it to.

```
sudo reboot
```
