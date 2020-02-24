#!/bin/bash

cd ~/raspiashow

source dependencies.sh 

cp -r config/i3 ~/.config
cp config/.xinitrc ~
cp config/.bash_profile ~

yarnpkg install
