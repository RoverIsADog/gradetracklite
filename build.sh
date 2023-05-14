#!/bin/bash
# 
# This is a quick script to build the project into a state where
# it can run.
# 
# It first compiles the React project into static files, then moves
# those files into the public folder of the server.

echo "#################################"
echo "#        BUILDING CLIENT        #"
echo "#################################"
BASEDIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $BASEDIR || exit

# Make sure required folder exist
rm -r server/public
if [[ ! -d server/public ]]; then
    mkdir -p server/public > /dev/null
fi

# Compile frontend into static webpage
cd client || exit
echo "Building static website"
npm install
npm run build

# Copy it over the backend
echo "Copying to backend folder..."
cp -a dist/. ../server/public/

echo "#################################"
echo "#       CREATING SERVER         #"
echo "#################################"

cd ../server || exit

npm install

cd $BASEDIR || exit
source ./createconfigs.sh

echo "#################################"
echo "#         Build COMPLETE        #"
echo "#################################"
