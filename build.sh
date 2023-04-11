#!/bin/bash
# 
# This is a quick script to build the project into a state where
# it can run.
# 
# It first compiles the React project into static files, then moves
# those files into the public folder of the server.

echo "#################################"
echo "#         Build Script          #"
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
cp -a build/. ../server/public/

cd ../server || exit

npm install

# Creating configuration files, if doesn't exist
if [[ ! -f conf/.env ]]; then
    echo "Missing .env configuration file. Creating it now with default values...";
    mkdir -p conf/ > /dev/null
    touch conf/.env > /dev/null
    echo '# The following keys are relating to JWT secrets' >> conf/.env
    echo 'JWT_SECRET = "pizza hut"' >> conf/.env
    echo 'JWT_EXPIRATION_TIME = 86400' >> conf/.env
    echo '' >> conf/.env
    echo '# What port to run the server on' >> conf/.env
    echo 'PORT = 8000' >> conf/.env
    echo '' >> conf/.env
    echo '# The following keys are relating the whether to use HTTPS.' >> conf/.env
    echo '# SSL_PRIVATE_KEY and SSL_CERTIFICATE only required if using HTTPS.' >> conf/.env
    echo 'HTTPS_ENABLED = false' >> conf/.env
    echo 'SSL_PRIVATE_KEY = conf/key.pem' >> conf/.env
    echo 'SSL_CERTIFICATE = conf/cert.pem' >> conf/.env
fi

# Creating sample privacy policies if doesn't exist
if [[ ! -f docs/privacy.md || ! -f docs/terms.md ]]; then
    mkdir -p docs/ > /dev/null
    touch docs/privacy.md > /dev/null
    echo '# Privacy Policy' >> docs/privacy.md
    echo 'This is a sample privacy policy. You are free to change it.' >> docs/privacy.md
    echo '## Praesent est est' >> docs/privacy.md
    echo 'Praesent pretium rutrum nunc, vitae feugiat sapien ultrices bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur auctor condimentum tortor, id tempus tellus fringilla sed. Curabitur malesuada velit et metus aliquet lobortis. Praesent magna sapien, euismod semper mi ut, molestie egestas enim. Praesent quis efficitur nisl. Praesent est est, aliquam ut metus id, tempor tempor ipsum.' >> docs/privacy.md
    
    touch docs/terms.md > /dev/null
    echo '# Terms of use' >> docs/terms.md
    echo 'This is a sample terms of use. You are free to change it.' >> docs/terms.md
    echo '## Praesent est est' >> docs/terms.md
    echo 'Praesent pretium rutrum nunc, vitae feugiat sapien ultrices bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur auctor condimentum tortor, id tempus tellus fringilla sed. Curabitur malesuada velit et metus aliquet lobortis. Praesent magna sapien, euismod semper mi ut, molestie egestas enim. Praesent quis efficitur nisl. Praesent est est, aliquam ut metus id, tempor tempor ipsum.' >> docs/terms.md
fi

echo "#################################"
echo "#         Build COMPLETE        #"
echo "#################################"
echo "Next steps: start the server (either start.sh or npm start in the server folder)"
echo "Adding SSL encryption? To quickly setup a self-signed SSL key:"
echo "(1): Toggle USE_HTTPS to true in server/conf/.env"
echo "(2): Generate a SSL key in server/conf"
echo "(2): Generate a SSL key in server/conf"
echo "        --> openssl genrsa -out key.pem"
echo "(3): Generate a certification request for the key"
echo "        --> openssl req -new -key key.pem -out csr.pem"
echo "(4): Self-certify your key (your browser WILL complain, but whatever)"
echo "        --> openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem"
echo "This key is self certified so your browser WILL complain. It also never expires. We recommend you certify your key from a reputable certification authority."
echo "It you're hosting, the easiest way is probably using Certbot (https://certbot.eff.org/)"