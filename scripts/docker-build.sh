#!/bin/sh

if [ -z "$1" ]; then
    echo "No tag"
    exit 1
fi

tag="dx-demos:$1"
commit=$(git rev-parse HEAD)
branch=$(git rev-parse --abbrev-ref HEAD)

docker build -t "$tag" \
    --build-arg commit="$commit" --build-arg branch="$branch" \
    .
