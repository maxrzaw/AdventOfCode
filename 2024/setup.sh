#!/bin/bash

# Get the day, I made it the second argument so I won't have to copy the cookie
day=$2

if [ -d day$day ]
then
    echo Folder day$day already exists. Not copying templates.
else
    mkdir day$day
    cp template/* day${day}/
fi

echo Switching do directory "day${day}/"
cd day$day

# use the provided session cookie and request the input file
trimmed_day=$(echo $day | sed 's/^0*//')
curl -s -b "session=${1}" https://adventofcode.com/2024/day/${trimmed_day}/input -o input.txt

echo You are all set up for day ${day}! Have fun!
