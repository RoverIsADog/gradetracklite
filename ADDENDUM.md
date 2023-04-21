# Manual Installation Instructions

If you have no way to run bash scripts, the steps below are what the build and start scripts basically do.

## Compiling the client

1. `cd` into the `client` folder, and run `npm install` to install all the client dependencies.
2. Compile the client using `npm run build`
3. Create a folder `server/public`
4. Copy the **contents** of the `build` folder into `server/public` (don't copy the build folder). The `server/public` folder should now contain a folder `staic`, `index.html` and a few other files.

## Creating required files

1. Inside `server/conf`, **create a file `.env`** (you can copy from the one above).
2. Inside `server/docs`, **create a file `privacy.md`** and fill it with your privacy policy.
3. Inside `server/docs`, **create a file `terms.md`** and fill it with your terms of use.
4. At this point, you will want to change the JWT_SECRET and enable HTTPS as explained in the [readme](./README.md).

## Starting the server

1. `cd` into the `server` folder, and run `npm install` to install all the server dependencies.
2. Start the server by running `npm run start`

# Self generating a key and certificate

You will need the `openssl` command line utility. If unavailable, you will need to find another way to generate a key and certificate.

* Generate a SSL key in `server/conf`.

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
