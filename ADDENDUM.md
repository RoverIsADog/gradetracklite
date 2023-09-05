# Manual Installation Instructions

If you have no way to run bash scripts, the steps below are what the build and start scripts basically do.

## Compiling the client

1. `cd` into the `client` folder, and run `npm install` to install all the client dependencies.
2. Compile the client using `npm run build`
3. Create a folder `server/public`
4. Copy the **contents** of the `build` folder into `server/public` (don't copy the build folder itself). The `server/public` folder should now contain `static/`, `index.html` and a few other files.

## Creating data files

1. Inside `/data/conf`, **create a file `.env`** (you can copy the one below).
2. Inside `/data/docs`, **create a file `privacy.md`** and fill it with your privacy policy written in markdown.
3. Inside `/data/docs`, **create a file `terms.md`** and fill it with your terms of use written in markdown.
4. At this point, you will want to change the JWT_SECRET and enable HTTPS as explained in the [README](./README.md).

Sample `/data/conf/.env` file
```yaml
# The following keys are relating to JWT secrets
JWT_SECRET = "some_random_string"
JWT_EXPIRATION_TIME = 86400

# What port to run the server on
PORT = 8000

# The following keys are relating the whether to use HTTPS.
# SSL_PRIVATE_KEY and SSL_CERTIFICATE only required if using HTTPS.
HTTPS_ENABLED = false
SSL_PRIVATE_KEY = conf/key.pem
SSL_CERTIFICATE = conf/cert.pem
```

## Starting the server

1. `cd` into the `server` folder, and run `npm install` to install all the server dependencies.
2. Start the server by running `npm run start`

# Manual Installation (Docker)
If you prefer manually building the image and running a docker container, then follow these steps.
## Building image
In the root folder, create a docker image from scratch from the dockerfile (you can name it whatever you want).
```bash
docker build --tag gradetracklite:1.1 .
```
Then, generate the sample data files inside `/data/`.
```bash
./generateconfigs.sh
```
If you are unable to run the bash script, you will have to [create the data files yourself](/ADDENDUM.md#creating-data-files).

## Modify the data files (optional)
See readme.

## Run the container
Run the previously created image.
```sh
# If using docker-compose, ignore this
docker run --name gradetracklite_c1 --volume ./data:/gradetracklite/data --publish 8000:8000 gradetracklite:1.1
# If on Windows, you MUST use DOS paths for the host folder. I.e. use ".\data:..." instead of /data:..."
```

# Self generating a key and certificate

You will need the `openssl` command line utility. If unavailable, you will need to find another way to generate a key and certificate.

* Generate a SSL key in `/data/conf/`.

```bash
# cd into server/conf, then:
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

# HTTP redirection

When entering `host.com`, browsers will default to using HTTP and the HTTP port 80 (aka `http://host.com:80`). When entering `https://host.com`, browsers will default to the HTTPS port 443 (aka `https://https://host.com:443`).

Assuming you are hosting on `gtl.mydomain.com` and have HTTPS enabled, you should preferrably host on port 443. However, most users are used to typing only `gtl.mydomain.com`, which defaults to `http://gtl.mydomain.com:80`, where there is nothing. To avoid this and make it convenient to users, you can setup a webserver on port 80 which permanently redirects to the HTTPS address: `https://gtl.mydomain.com:443`.

The GradeTrackLite server does not support displaying a website at both the HTTP and HTTPS ports simultaneously.

# Setting up a development environment
### Client
`cd` into `client` and run `npm run dev` to start a development server serving the frontend that refreshes any time there is a change. The development server proxies every API calls to `http://localhost:8000`, so make sure the backend server runs there. You can modify this [here](./client/vite.config.js). See [package.json](./client/package.json) for more info on the scripts.

### Server
`cd` into `server` and run `npm run startDev` to start a development server that restarts on every change. See [package.json](./server/package.json) for more info on the scripts. Make sure to start it on the same port and protocol as the client development server is proxying to!

