# GradeTrackLite

GradeTrackLite is a privacy-oriented grade tracking app that can be self hosted.

## Requirements
* You must have Node.js installed on your system. Download it here https://nodejs.org/
* Your system must be able to run bash files (linux, macOS). If you are using Windows, you can run the scripts using Git Bash, MinGW, etc. Otherwise, you'll have to follow the detailed installation instructions.

## Quick Installation
In the root folder, run the build script. It will compile and create the required files for you.
```bash
./build.sh
```

## Before Starting
The build script will create a couple of files for you, which you may want to change.
### `server/docs`
The `docs` folder contains the privacy policy (`privacy.md`) and the terms of use (`terms.md`) that will be shown to users of your GradeTrackLite instance. The build script will insert lorem ipsum into them, and you should change it to your practices. 

They should be written in markdown.

### `server/conf`
The `conf` folder contains your GradeTrackLite instance's configuration files. **These settings are crucial to the security of your GTL instance.**

You should change the `JWT_SECRET` to a secret string only you know. Don't leave it as the default.

We also recommend you enable HTTPS by providing your own SSL key and certificate so that data is encrypted during traffic. Place your key in the `conf` folder named `key.pem` and the certificate next to it named `cert.pem`. You can find more info at the bottom of the page.

`.env`
```yaml
# The jwt secret is used for token signing.
JWT_SECRET = "some_random_string"
# How long before users need to login again.
JWT_EXPIRATION_TIME = 86400

# What port to run the server on.
PORT = 8000

# The following keys are relating the whether to use HTTPS.
# SSL_PRIVATE_KEY and SSL_CERTIFICATE only required if using HTTPS (paths to key/cert).
# Their paths are relative to the server folder.
HTTPS_ENABLED = false
SSL_PRIVATE_KEY = conf/key.pem
SSL_CERTIFICATE = conf/cert.pem

```

## Starting
```bash
./start.sh
```

## Enabling HTTPS
Below are instructions to quickly get HTTPS up.

* Toggle USE_HTTPS to true in server/conf/.env"
* Generate a SSL key in server/conf"
```bash
openssl genrsa -out key.pem
```
* Generate a certification request for the key
```bash
openssl req -new -key key.pem -out csr.pem
```
* Self-certify your key
```bash
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```
Note that the key is self-certified so browsers will complain and show a warning. It also never expires. We recommend you certify your key from a root certification authority. It you're hosting on your own machine, the easiest way is probably using Certbot (https://certbot.eff.org/).


## Detailed Installation Instructions
If you have no way to run bash scripts, the steps below are what the build and start scripts basically do.

### Compiling the client
1. `cd` into the `client` folder, and run `npm install` to install all the client dependencies.
2. Compile the client using `npm run build`
3. Create a folder `server/public`
4. Copy the __contents__ of the `build` folder into `server/public` (don't copy the build folder). The `server/public` folder should now contain a folder `staic`, `index.html` and a few other files.

### Creating required files
1. Inside `server/conf`, **create a file `.env`** (you can copy from the one above).
2. Inside `server/docs`, **create a file `privacy.md`** and fill it with your privacy policy.
2. Inside `server/docs`, **create a file `terms.md`** and fill it with your terms of use.
3. At this point, you will want to change the JWT_SECRET and enable HTTPS as explained above

### Starting the server
1. `cd` into the `server` folder, and run `npm install` to install all the server dependencies.
2. Start the server by running `npm run start`

