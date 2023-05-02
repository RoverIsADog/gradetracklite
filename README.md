# GradeTrackLite

GradeTrackLite is a privacy-oriented grade tracking app that can be self hosted.

The frontend is written in Javascript using React and built using Vite. Most files make use of type hints along with `ts-check` whenever possible for greater safety. 

The backend is written in Javascript using Express.

## Features
* Keep track of past and future grades
* Keep track of course and semester GPAs
* Hierarchy: Semester > Course > Grade Category > Grade

## Disclaimer

**USE AT YOUR OWN RISK**. This project **prototype** was made in a short amount of time as part of a course. The _existence_ of data privacy features and meeting the deadline were the priority. Bugs, vulnerabilities, spagetti code, antipatterns, etc. may be present. Also be aware that there are always risks with opening any port on your network. The authors of this project are not responsible for any damages arising from using this project.

Here is a sample of known issues in no particular order: storing keys and secrets in a `.env` file instead of environment variables (or using a key vault), using an `.env` file in production, lack of frontend and/or backend input checking, occasional frontend-server desync, **frontend/backend console printing of debug info (potentially sensitive)**, ...

## Requirements

* Node.js installed on your system. Download it [here](https://nodejs.org/).
* A system capable to run bash files (e.g. linux, macOS). If you are using Windows, you can run the scripts using Git Bash, MinGW, etc. Otherwise, you'll have to follow the manual installation instructions [here](./ADDENDUM.md#manual-installation-instructions).
* Rudimentary familiarity with the command line and opening ports.

## Quick Installation

In the root folder, run the build script. It will compile GradeTrackLite and create the required files.

```bash
./build.sh
```

## Before Starting

The build script will create a couple of files, which you may want to modify.

### `server/docs`

The `docs` folder contains the privacy policy (`privacy.md`) and the terms of use (`terms.md`) that will be shown to users of your GradeTrackLite instance. The build script will insert lorem ipsum into them, and you should change it to your practices.

They are parsed as markdown.

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

To quickly get HTTPS up and running:

* Toggle USE_HTTPS to true in `server/conf/.env`
* [Self generate a key and certification](./ADDENDUM.md#self-generating-a-key-and-certificate) or provide your own (make sure to update `SSL_PRIVATE_KEY` and `SSL_CERTIFICATE` to their paths in `.env`).

You may want to have an [HTTP redirect server](/ADDENDUM.md#http-redirection) for convenience.

Finally, you must open the port you are using (or port forward it to an open port).

## Starting

```bash
# Clone the repository and cd into its folder, then:
./start.sh
```

## Using

Accessible on browser (JavaScript required) at: `protocol://address:port`

| URL component | Replace with |
| --- | --- |
| `protocol` | Either `http` or `https`, depending on if HTTPS is enabled. |
| `address` | The IP address of the host or a domain name that redirects to said address |
| `port` | Specified in `.env`|

