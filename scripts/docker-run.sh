#!/bin/sh

if [ -z "$1" ]; then
    echo "No tag"
    exit 1
fi
if [ -z "$2" ]; then
    echo "No port"
    exit 1
fi

tag="dx-demos:$1"
name="dx-demos-$1"

port_range=6
src_port1=$2
src_port2=$(($src_port1 + $port_range))
dst_port1=3000
dst_port2=$(($dst_port1 + $port_range))

docker run -d -p "$src_port1-$src_port2:$dst_port1-$dst_port2" --restart unless-stopped --name "$name" "$tag"
