# GradeTrackLite

GradeTrackLite is a privacy-oriented grade tracking app that can be self hosted.

The frontend is written in Javascript using React and built using Vite. Most files make use of type hints along with `ts-check` whenever possible for greater safety. The backend is written in Javascript using Express.

> NOTE: Read the [disclaimer](#disclaimer)!

## Features
* Keep track of past and future grades
* Compute and keep track of averages and course GPAs
* Hierarchy: Semester > Course > Grade Category > Grade
* Dark and light mode (only in the dashboard)

## Requirements

* Node.js installed on your system. Download it [here](https://nodejs.org/).
* A system capable of running bash files (e.g. linux, macOS). If you are using Windows, you can run the scripts using Git Bash, MinGW, etc. Otherwise, you'll have to follow the manual installation instructions [here](./ADDENDUM.md#manual-installation-instructions).
* Rudimentary familiarity with the command line and opening ports.
* Docker (if running in a container).

## 1. Building

Docker instructions below.

In the root folder, run the build script. This all-in-one script will compile GradeTrackLite and create sample data files inside `/data/`. 

```bash
./build.sh
```

## 2. Modifying data files (optional) 
* You may want to modify the sample config file at `/data/conf/.env`.
  * Change the `JWT_SECRET` to a secret string only you know. Don't leave it as the default.
* You should replace the lorem ipsum privacy policy and terms of use with your own in `/data/docs` (written in maarkdown).
* If you have previous GTL user data, move the old `database.db` into `/data/`.

> ### Quickly get HTTPS up and running: 
> * Toggle HTTPS_ENABLED to true in `/data/conf/.env`
> * [Self generate a key and certificate](./ADDENDUM.md#self-generating-a-key-and-certificate) or provide your own.
> * Put the SSL key and certificate in `/data/conf/` as `key.pem` and `cert.pem` respectively.
> 
> You may want to have an [HTTP redirect server](/ADDENDUM.md#http-redirection) for convenience.

## 3. Opening ports (optional)
If you intend to use GTL outside of your local network, you will need to open the port specified in the configuration file. Using HTTPS strongly recommended.

## 4. Starting

```bash
./start.sh
```

## 5. Accessing

Accessible on any browser (JavaScript required) at: `protocol://address:port`. It has only been tested on Chrome and Firefox.

| URL component | Replace with |
| --- | --- |
| `protocol` | Either `http` or `https`, depending on if HTTPS is enabled. |
| `address` | The IP address of the host or a domain name that redirects to said address |
| `port` | Specified in `.env`|

## Using Docker

It is preferrable to use docker-compose for simplicity. If you prefer manually setting docker up, then [see here](/ADDENDUM.md#manual-installation-docker). 

In the root folder, create a `docker-compose.yml` file with the following contents.

```yaml
version: '3'
services:
  gradetracklite:
    image: gradetracklite:1.0
    build: .
    container_name: gradetracklite_c1
    ports:
      # Make sure to update this if you changed the port in the configs
      - "8000:8000"
    volumes:
      # "./data" can be placed wherever on host system
      - ./data:/gradetracklite/data 

```

**Create the data files** with `./createconfigs.sh` and modify them (see step 2 above, optional)

**Start** with `docker-compose up`

**Stop** with `docker-compose down` in another terminal window.
 * If you don't want GTL images lingering around, then use `docker-compose down --rmi all --volumes` to also delete them.

## Read more
* [Manual installation](/ADDENDUM.md#manual-installation-instructions)
* [Self gen+cert key](/ADDENDUM.md#self-generating-a-key-and-certificate)
* [Setting up a development environment](/ADDENDUM.md#setting-up-a-development-environment)
* [HTTP redirection](/ADDENDUM.md#http-redirection)

## Disclaimer

**USE AT YOUR OWN RISK**. This project **prototype** was made in a short amount of time as part of a data privacy course. The _existence_ of data privacy features and meeting the deadline were the priority. Bugs, vulnerabilities, spagetti code, antipatterns, etc. may be present. Also be aware that there are always risks with opening any port on your network. The authors of this project are not responsible for any damages arising from using this project.

Here is a sample of known issues in no particular order: storing keys and secrets in a `.env` file instead of environment variables (or using a key vault), using an `.env` file in production, lack of frontend and/or backend input checking, occasional frontend-server desync, **frontend/backend console printing of debug info (potentially sensitive)**, ...