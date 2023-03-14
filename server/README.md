# API Requests
This document serves as a guide to the various POST, GET, DELETE, and PUT requests that can be made to the server of the web application.

It outlines what information is expected in the `req.body` for each request type. Additionally, it provides details on the JSON output that will be returned in the event of success or error.

By referencing this document, users of our application can ensure that they are making requests with the correct syntax and can better understand any errors they encounter.

# Requests

## Login (POST `/login`)

### Request

On the login page, the user enters their username and password, and the frontend will send a POST request with the following content:

- username
- password
- email

Here is a sample request:

```JSON
{
    "username": "JDoe",
    "password": "123456",
    "email": "jodoe@email.com"
}
```

### Response

The server checks if the username exists in the database, and then checks if the password matches the user's password.
It then sends a response with the following content:

- error
- error message
- token

The error code corresponds to 0 for a successful login, otherwise the login failed. In case of success, the server sends the username, the email and the user's UUID back to the server. This information is protected in a signed [JWT token](https://jwt.io/introduction) that expires one hour after the user has logged in.

Here is a sample success response:

```JSON
{
    "error": 0,
    "error_message": "Successful login",
    "token": "H1E2A3D3E4R.P1A2Y3L4O5A6D.S1I2G3N4A5T6U7R8E"
}
```

Here is a sample fail response:

```JSON
{
    "error": 1,
    "error_message": "Invalid username or password"
}
```

## Register (POST `/register`)

### Request

On the register page, the user enters their username and password, and an optional email, and the frontend will send a POST request with the following content:

- username
- password
- email

Here is a sample request:

```JSON
{
    "username": "JDoe",
    "password": "123456",
    "email": "jodoe@email.com"
}
```

### Response

The server checks if the username exists in the database, and creates a new user with the given information if not.
It then sends a response with the following content:

- error
- error message

The error code corresponds to 0 for a successful registration, otherwise it failed.

Here is a sample success response:

```JSON
{
    "error": 0,
    "error_message": "User created successfully"
}
```

Here is a sample fail response:

```JSON
{
    "error": 1,
    "error_message": "Username already exists"
}
```
