#!/bin/bash

echo "Make sure to run build before starting"

BASEDIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $BASEDIR || exit

cd server || exit
npm start
