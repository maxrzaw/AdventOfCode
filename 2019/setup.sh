#!/bin/bash

# Get the day, I made it the second argument so I won't have to copy the cookie
# use the provided session cookie and request the input file
curl -s -b "session=${1}" https://adventofcode.com/2019/day/20/input -o input.txt
