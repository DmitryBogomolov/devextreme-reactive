#!/bin/bash

BASE_NAME="dx-demos"

validate_image() {
    if [ -z "$1" ]; then
        echo "Image is not defined"
        exit 1
    fi
}

get_image_name() {
    echo "$BASE_NAME:$1"
}

build() {
    echo "- Build -"

    validate_image "$1"
    local name=$(get_image_name $1)
    local commit=$(git rev-parse HEAD)
    local branch=$(git rev-parse --abbrev-ref HEAD)

    docker build \
        -t "$name" \
        --build-arg commit="$commit" --build-arg branch="$branch" \
        .

    echo "- done -"
}

get_container_name() {
    echo "$BASE_NAME-$1"
}

validate_port() {
    if [ -z "$1" ] || [ "$1" -lt 30000 ]; then
        echo "Port is not valid"
        exit 1
    fi
}

get_port_desc() {
    local port_range=2
    local src_port1="$1"
    local src_port2=$(($src_port1 + $port_range))
    local dst_port1=3002
    local dst_port2=$(($dst_port1 + $port_range))
    echo "$src_port1-$src_port2:$dst_port1-$dst_port2"
}

run() {
    echo "- Run -"

    validate_image "$1"
    local image=$(get_image_name "$1")
    local name=$(get_container_name "$1")

    validate_port "$2"
    local port_desc=$(get_port_desc "$2")

    docker run \
        -d --restart unless-stopped \
        -p "$port_desc" \
        --name "$name" \
        "$image"

    echo "- done -"
}

stop() {
    validate_image "$1"
    local name=$(get_container_name "$1")
    docker stop "$name"
}

remove() {
    validate_image "$1"
    local name=$(get_container_name "$1")
    docker rm -f "$name"
}

list() {
    docker ps --filter "name=$BASE_NAME"
}

list_images() {
    docker images "$BASE_NAME"
}

print_usage() {
    echo "- Usage -"
    echo "  build <tag>"
    echo "  run <tag> <base_port>"
    echo "  stop <tag>"
    echo "  remove <tag>"
    echo "  list"
    echo "  images"
    echo ""
}

cmd="$1"
case "$cmd" in
    build)
    build "$2"
    ;;
    run)
    run "$2" "$3"
    ;;
    stop)
    stop "$2"
    ;;
    remove)
    remove "$2"
    ;;
    list)
    list
    ;;
    images)
    list_images
    ;;
    * | -h | --help)
    print_usage
    ;;
esac
