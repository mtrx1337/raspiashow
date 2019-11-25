# partition table for the memory card

DOS partition table

- 4.00   MiB
    - unallocated

- 256.00 MiB
    - fat32
    - label: boot
    - partition flags
        - lba

- rest
    - unallocated

# partition table for usb stick

GPT partition table

- 3.5 GiB
    - ext4
    - label: root

- rest
    - unallocated

# flashing

```
dd if=rispi-boot of=/dev/mmcblkXp1
dd if=rispi-root of=/dev/sdY1
```

where X is the device number of your memory card  
and Y is the device number of your USB stick

devices are listed in `lsblk` 
