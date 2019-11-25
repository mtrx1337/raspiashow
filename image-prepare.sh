#!/bin/bash

mount -t proc /proc/ $MOUNT_POINT/proc
mount --rbind /sys/  $MOUNT_POINT/sys
mount --rbind /dev/  $MOUNT_POINT/dev

cp /etc/resolv.conf $MOUNT_POINT/etc/resolv.conf

cp -r ./browser-app $MOUNT_POINT/home/pi/
chroot $MOUNT_POINT curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
chroot $MOUNT_POINT echo 'deb https://dl.yarnpkg.com/debian/ stable main' | sudo tee /etc/apt/sources.list.d/yarn.list

umount $MOUNT_POINT/proc
umount $MOUNT_POINT/sys
umount $MOUNT_POINT/dev

rm -rf $MOUNT_POINT/proc
rm -rf $MOUNT_POINT/sys
rm -rf $MOUNT_POINT/dev
