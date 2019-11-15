#!/bin/bash

# Global Vars
MOUNT_POINT="/mnt/raspiashow"

# clean up mounts, mount directories, etc...
clean_up() {
    echo "UNMOUNTING PARTITIONS"
    umount $MOUNT_POINT
    if [[ $? -ne 0 ]]; then echo "Could not unmount partitions, exiting."; $(clean_up); exit 1; fi

    #rm -rf "$MOUNT_POINT"

    REMAINING_LP_DEV=$(losetup -a | awk '{print $1}' | sed 's/://')
    echo "REMOVING LOOP DEVICE"
    if [[ -z "$REMAINING_LP_DEV" ]]
    then
        for dev in "$REMAINING_LP_DEV"
        do losetup -d $dev
        done
    fi
}

# check if at least one commandline parameter was supplied
if [ $# -eq 0 ]; then echo "No arguments supplied."; exit 1; fi

# check if image file exists and is valid
IMAGE=$1
test -f $IMAGE
if [[ $? -ne 0 ]]; then echo "File supplied not valid."; fi

# check for root access
if [[ "$EUID" -ne 0 ]]; then echo "Please run as root."; exit 1; fi

# make sure important programs are installed
which partx &> /dev/null
if [[ $? -ne 0 ]]; then echo "Please install partx."; exit 1; fi
which losetup &> /dev/null
if [[ $? -ne 0 ]]; then echo "Please install losetup."; exit 1; fi



echo "MOUNTING IMAGE PARTITIONS TO LOOP DEVICE"



# mount partitions of raspbian image
LOSETUP_MOUNT_OUTPUT=$(losetup -v -f "$IMAGE")
# which loop device was used?
LOOP_DEV=$(losetup -a | tail -n 1 | awk '{print $1}' | sed 's/://')
# add partitions to loop device
#partx -v --add $LOOP_DEV
LP_DEV_PARTITIONS=$(blkid | grep loop | awk '{print $1}' | sed 's/://')



echo "MOUNTING PARTITIONS"



# create mount directory for the partitions
test -d "$MOUNT_POINT" || mkdir "$MOUNT_POINT"

# mount all partitions
for part in $LP_DEV_PARTITIONS
do
    echo $part
    mount $part $MOUNT_POINT
    if [[ $? -ne 0 ]]; then echo "Could not mount partitions, exiting."; clean_up; exit 1; fi
done

###### do stuff with them ######
ls /mnt/raspiashow

$(clean_up)
