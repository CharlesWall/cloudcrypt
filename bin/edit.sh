#!/bin/bash

tempfile=mktemp

read -s -p "Enter Password: " password
cc decrypt $1 > $tempfile --password $password && \
vim $tempfile && \
cc encrypt $tempfile $1 --password $password
password="[deleted]"
rm $tempfile
