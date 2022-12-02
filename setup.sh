#!/bin/bash

day=`date +"%d"`

if [ -d $day ]
then
    echo Folder $day already exists
    cd $day
    return
else
    mkdir $day
fi

cd $day

cp ../template/* ./

echo "// You are all set up for day ${day}! Have fun!" >> a.ts
vim a.ts
