#!/bin/bash

# Get the day, I made it the second argument so I won't have to copy the cookie
day=$2

if [ -d rust-${day} ]
then
    echo Folder rust-${day} already exists. Not copying templates.
else
    cargo new rust-${day} --vcs=none
fi

echo Switching do directory "rust-${day}/"
cd rust-${day}
touch example.txt

# use the provided session cookie and request the input file
trimmed_day=$(echo $day | sed 's/^0*//')
curl -s -b "session=${1}" https://adventofcode.com/2022/day/${trimmed_day}/input -o input.txt

echo You are all set up for day ${day} in rust! Have fun!
