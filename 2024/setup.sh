#!/bin/bash

# Get the day, I made it the second argument so I won't have to copy the cookie
day=$2

if [ -d $day ]
then
    echo Folder $day already exists. Not copying templates.
else
    mkdir $day
    cp template/* ${day}/
fi

echo Switching do directory "$day/"
cd $day

# use the provided session cookie and request the input file
trimmed_day=$(echo $day | sed 's/^0*//')
curl -s -b "session=${1}" https://adventofcode.com/2022/day/${trimmed_day}/input -o input.txt

echo You are all set up for day ${day}! Have fun!
