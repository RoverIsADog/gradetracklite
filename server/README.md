# API Requests

This document serves as a guide to the various API requests that can be made to the server of the web application.

It outlines what information is expected in the `req.body` for each POST request, and what information is expected in the header for each GET request. Additionally, it provides details on the JSON output that will be returned in the event of success or error.

By referencing this document, users of our application can ensure that they are making requests with the correct syntax and can better understand any errors they encounter.

List of all requests:

- [POST /login](https://gitlab.cs.mcgill.ca/yzhou131/react-js-tests2/-/blob/feat/server/server/README.md#login-post-login)
- [POST /register](https://gitlab.cs.mcgill.ca/yzhou131/react-js-tests2/-/blob/feat/server/server/README.md#register-post-register)
- [GET /semesters](https://gitlab.cs.mcgill.ca/yzhou131/react-js-tests2/-/blob/feat/server/server/README.md#semesters-get-semesters)
- [GET /courses](https://gitlab.cs.mcgill.ca/yzhou131/react-js-tests2/-/blob/feat/server/server/README.md#courses-get-courses)
- [POST /add-semester](https://gitlab.cs.mcgill.ca/yzhou131/react-js-tests2/-/blob/feat/server/server/README.md#create-a-semester-post-add-semester)
- [POST /add-course](https://gitlab.cs.mcgill.ca/yzhou131/react-js-tests2/-/blob/feat/server/server/README.md#create-a-course-post-add-course)

# Authentication

This section pertains to the API requests related to authentication (login and register).

## Login (POST `/login`)

### Request

On the login page, the user enters their username and password, and the frontend will send a POST request with the following content:

- username
- password

Here is a sample request:

```JSON
{
    "username": "JDoe",
    "password": "123456"
}
```

### Response

The server checks if the username exists in the database, and then checks if the password matches the user's password.
It then sends a response with the following content:

- error
- message
- token

The error code corresponds to 0 for a successful login, otherwise the login failed.

| Error Code | Code Meaning          |
| :--------- | :-------------------- |
| 0          | Successful login      |
| 1          | Invalid password      |
| 2          | Invalid username      |
| -1         | Internal server error |

In case of success, the server sends the username, the email and the user's UUID back to the frontend. This information is protected in a signed [JWT token](https://jwt.io/introduction) that expires one hour after the user has logged in.

Here is a sample success response:

```JSON
{
    "error": 0,
    "message": "Successful login",
    "token": "H1E2A3D3E4R.P1A2Y3L4O5A6D.S1I2G3N4A5T6U7R8E"
}
```

Here is a sample fail response:

```JSON
{
    "error": 1,
    "message": "Invalid username or password",
    "token": null
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

The server checks if the username exists in the database, and creates a new user with the given information if not. The username is stored as it is, but the password is hashed before being stored in the database.
It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful registration, otherwise it failed.

| Error Code | Code Meaning            |
| :--------- | :---------------------- |
| 0          | Successful registration |
| 1          | Username already exists |
| -1         | Internal server error   |

Here is a sample success response:

```JSON
{
    "error": 0,
    "message": "User created successfully"
}
```

Here is a sample fail response:

```JSON
{
    "error": 1,
    "message": "Username already exists"
}
```

# Dashboard Loading

This section pertains to the API requests related to loading information to the dashboard (loading, adding and modifying information).

## Semesters (GET `/semesters`)

### Request

Upon successful login, the user is redirected to the dashboard page. The semesters section fetches the semesters from the user on page load with a GET request with the following header:

- `Authorization: Bearer \<JWT Token\>`

### Response

The server checks if the JWT token is valid. Then, it checks if it does contain the 'uuid' parameter in its payload. It then extracts the user's UUID and checks if the UUID exists in the database, and gets all semesters from that user.
It then sends a response with the following content:

- error
- message
- semester_list

The error code corresponds to 0 for a successful fetch, otherwise it failed.

| Error Code | Code Meaning                               |
| :--------- | :----------------------------------------- |
| 0          | Semesters successfully fetched             |
| 1          | User does not exist                        |
| 2          | Missing token                              |
| 3          | Token decoding or verification failed      |
| 4          | Invalid token (invalid or no 'uuid' param) |
| 5          | Expired token                              |
| -1         | Internal server error                      |

Here is a sample success response:

```JSON
{
    "error": 0,
    "message": "Semesters successfully fetched",
    "semester_list": [
        {
            "uuid": "uuidv4()",
            "semester_name": "Winter 2023"
        },
        {
            "uuid": "uuidv4()",
            "semester_name": "Fall 2022"
        }
    ]
}
```

Here is a sample fail response:

```JSON
{
    "error": 1,
    "message": "User does not exist",
    "semesterList": []
}
```

## Courses (GET `/courses`)

### Request

On the dashboard page, whenever the user selects a semester, the frontend will send a GET request with the following URL search parameter:

- `semester_id=<SEMESTER_UUID>`

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

### Response

The server checks if the JWT token is valid. Then, it checks if it does contain the 'uuid' parameter in its payload. It then extracts the user's UUID and checks if the UUID exists in the database, and if the semester belongs to the user (matching foreign key). Finally, it gets all courses from that semester.
It then sends a response with the following content:

- error
- message
- course_list

The error code corresponds to 0 for a successful fetch, otherwise it failed.

| Error Code | Code Meaning                                         |
| :--------- | :--------------------------------------------------- |
| 0          | Courses successfully fetched                         |
| 1          | User does not exist                                  |
| 2          | Semester does not exist                              |
| 3          | User does not have authorized access to the semester |
| 4          | Missing token                                        |
| 5          | Token decoding or verification failed                |
| 6          | Invalid token (invalid or no 'uuid' param)           |
| 7          | Expired token                                        |
| -1         | Internal server error                                |

Here is a sample success response:

```JSON
{
    "error": 0,
    "message": "Courses successfully fetched",
    "course_list": [
        {
            "uuid": "ToJxpr77WuuQog4y",
            "course_name": "COMP 547",
            "course_credits": 4,
            "course_description": "Best class ever ong"
        },
        {
            "uuid": "ZIn4H0RzJUjq7gnZ",
            "course_name": "COMP 202",
            "course_credits": 3,
            "course_description": "When everything was still peaceful"
        },
        {
            "uuid": "vmXLXQziOjQuKO5r",
            "course_name": "COMP 547",
            "course_credits": 4,
            "course_description": "I dropped this class instantly"
        },
        {
            "uuid": "Ofjtibul4QdNos3l",
            "course_name": "COMP 111",
            "course_credits": 3,
            "course_description": "No Description"
        }
    ]
}
```

Here is a sample fail response:

```JSON
{
    "error": 3,
    "message": "User does not have authorized access to the specified semester",
    "course_list": []
}
```

## Create a Semester (POST `/add-semester`)

### Request

On the dashboard page, the user can add a new semester by providing a semester name, and the frontend will send a POST request with the following content:

- semester_name

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```JSON
{
    "semester_name": "Winter 2023"
}
```

### Response

The server verifies the JWT token, and creates a new semester with the given name.
It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful registration, otherwise it failed.

| Error Code | Code Meaning                               |
| :--------- | :----------------------------------------- |
| 0          | Semester created successfully              |
| 1          | User does not exist                        |
| 2          | Semester already exists                    |
| 3          | Missing token                              |
| 4          | Token decoding or verification failed      |
| 5          | Invalid token (invalid or no 'uuid' param) |
| 6          | Expired token                              |
| -1         | Internal server error                      |

Here is a sample success response:

```JSON
{
    "error": 0,
    "message": "Semester created successfully"
}
```

Here is a sample fail response:

```JSON
{
    "error": 1,
    "message": "Semester already exists"
}
```

## Create a Course (POST `/add-course`)

### Request

On the dashboard page, the user can add a new course by providing a course name and description, and the number of credits, and the frontend will send a POST request with the following content:

- semesterUuid
- courseName
- courseCredits
- courseDescription

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```JSON
{
    "semesterUuid": "47d4c077-45d2-49be-be29-7c57193a4f31",
    "courseName": "COMP 555",
    "courseCredits": 4,
    "courseDescription": "Best class ever ong"
}
```

### Response

The server verifies the JWT token and checks if the a course with the same name does not already exist. Then, it creates a new course with the given name, description and number of credits.
It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful registration, otherwise it failed.

| Error Code | Code Meaning                                                   |
| :--------- | :------------------------------------------------------------- |
| 0          | Course created successfully                                    |
| 1          | User does not exist                                            |
| 2          | Semester does not exist                                        |
| 3          | User does not have authorized access to the specified semester |
| 4          | Course already exists                                          |
| 5          | Missing token                                                  |
| 6          | Token decoding or verification failed                          |
| 7          | Invalid token (invalid or no 'uuid' param)                     |
| 8          | Expired token                                                  |
| -1         | Internal server error                                          |

Here is a sample success response:

```JSON
{
    "error": 0,
    "message": "Course created successfully"
}
```

Here is a sample fail response:

```JSON
{
    "error": 3,
    "message": "User does not have authorized access to the specified semester"
}
```
