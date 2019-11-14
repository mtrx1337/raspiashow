#!/bin/bash

clean_up() {
    rm -rf "$MOUNT_POINT"
    partx -v -d "$LOOP_DEV"
    LOOP_DEV=$(sudo losetup -f)
    sudo losetup -d $LOOP_DEV
}

IMAGE=$1
MOUNT_POINT="/mnt/raspiashow"

# check for root access
if [[ "$EUID" -ne 0 ]]; then echo "Please run as root."; exit 1; fi

PARTX_RETURN=$(which partx)
# make sure important programs are installed
if ! [[ $? -eq 0 ]]; then echo "Please install partx."; exit 1; fi

echo "MOUNTING IMAGE PARTITIONS TO LOOP DEVICE"
# mount partitions of debian image
PX_MOUNT_OUTPUT=$(partx -v -a "$IMAGE")
# which loop device was used?
LOOP_DEV=$(echo "$PX_MOUNT_OUTPUT" | grep "Trying to use" | awk '{print $4}' | sed "s/'//g")
# what partitions exist?
LOOP_PARTIONS=$(echo "$PX_MOUNT_OUTPUT" | grep "partition #" | awk '{print $1}' | sed 's/://g')

# create mount directory for the partitions
mkdir $MOUNT_POINT

echo "MOUNTING PARTITIONS"

# mount all partitions
for part in $LOOP_PARTIONS
do
    mount $part $MOUNT_POINT
    if ! [[ $? -eq 0 ]]; then echo "Could not mount partitions, exiting."; $(clean_up); exit 1; fi
done

###### do stuff with them ######
ls /mnt/raspiashow

echo "UNMOUNTING PARTITIONS"

# unmount all partitions
for part in LOOP_PARTIONS
do
    umount $MOUNT_POINT
    if ! [[ $? -eq 0 ]]; then echo "Could not unmount partitions, exiting."; $(clean_up); exit 1; fi
done

# delete mount directory again

$(clean_up)

