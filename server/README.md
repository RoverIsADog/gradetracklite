# Table of Contents

## List of all requests:

**All requests start with `hostname/api/v1`**

Authentication

- [POST /auth/login](#login-post-authlogin)
- [POST /auth/register](#register-post-authregister)

Semesters

- [GET /semesters/list](#list-of-semesters-get-semesterslist)
- [POST /semesters/add](#create-a-semester-post-semestersadd)
- [POST /semesters/edit](#edit-a-semester-post-semestersedit)
- [POST /semesters/delete](#delete-a-semester-post-semestersdelete)

Courses

- [GET /courses/list](#list-of-courses-get-courseslist)
- [POST /courses/add](#create-a-course-post-coursesadd)
- [POST /courses/edit](#edit-a-course-post-coursesedit)
- [GET /courses/get](#get-a-course-and-its-children-get-coursesget)
- [GET /courses/delete](#delete-a-course-post-coursesdelete)

Grade Categories

- [POST /categories/add](#create-a-grade-category-post-categoriesadd)
- [POST /categories/edit](#edit-a-category-post-coursesedit) (WIP)
- [POST /categories/delete](#delete-a-category-post-categoriesdelete)

Grade Items

- [POST /grades/add](#create-a-grade-item-post-gradesadd)
- [POST /grades/edit](#edit-a-grade-post-coursesedit) (WIP)
- [POST /grades/delete](#delete-a-grade-post-gradesdelete)

Account administration

- [POST /account/edit/info](#edit-account-information-post-accounteditinfo) (WIP)
- [POST /account/edit/password](#edit-account-password-post-accounteditpassword) (WIP)
- [GET /account/download](#request-data-download-get-accountdownload) (WIP)
- [POST /account/delete](#delete-account-post-accountdelete)

Static Resources

- [GET /](#compiled-website-get)
- [GET /static](#static-resources-get-static)

# API Requests

**This document now supersedes the Word document. The Word document will no longer be kept to date.**

This document serves as a guide to the various API requests that can be made to the server of the web application.

It outlines what information is expected in the payload for each POST request, and what URL parameters are expected for each GET request. Additionally, it provides details on the JSON output that will be returned in the event of success or error.

By referencing this document, users of our application can ensure that they are making requests with the correct syntax and can better understand any errors they encounter.

## General Syntax

`hostname/api/v1/dataTypeOrFunctionality/action`

Example: `localhost:8000/api/v1/courses/list`

| URL Element               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hostname`                | Always there. Address of the GradeTrackLite host                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `api/v1`                  | Always there. To distinguish API versions and from static files served from `/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `dataTypeOrFunctionality` | Denotes either a type of data (`semesters`/`courses`/`categories`/`grades`) or a functionality such as authentication or account management (`auth`/`account`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `action`                  | Do some action with regards to the resource or functionality. <br>For data, we generally have: <br> <ul><li>`list`: Given a parent's ID, get a list of all instances of that resource belonging to the parent.</li><li>`add`: Given a parent's ID, add an instance of the resource to the parent</li><li>`get`: Get a specific instance of the resource (and all "children"). Currently only for courses (and that won't change).</li><li>`edit`: Modifies a specified instance of the resource.</li><li>`delete`: Deletes a specified instance of the resource</li></ul>For functionalities, we have stuff like `login`/`resister`/... |

# Authentication

This section pertains to the API requests related to authentication (login and register).

## Login (POST `/auth/login`)

### Request

On the login page, the user enters their username and password, and the frontend will send a POST request with the following content:

- username
- password

Here is a sample request:

```json
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

| Error Code | Code Meaning            |
| :--------- | :---------------------- |
| 0          | Successful login        |
| 1          | Invalid password        |
| 2          | Invalid username        |
| -1         | Internal server error   |
| -2         | Missing required fields |

In case of success, the server sends the username, the email and the user's UUID back to the frontend. This information is protected in a signed [JWT token](https://jwt.io/introduction) that expires one hour after the user has logged in.

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Successful login",
  "token": "H1E2A3D3E4R.P1A2Y3L4O5A6D.S1I2G3N4A5T6U7R8E"
}
```

Here is a sample fail response:

```json
{
  "error": 1,
  "message": "Invalid username or password",
  "token": null
}
```

## Register (POST `/auth/register`)

### Request

On the register page, the user enters their username and password, and an optional email, and the frontend will send a POST request with the following content:

- username
- password
- email

Here is a sample request:

```json
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
| -2         | Missing required fields |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "User created successfully"
}
```

Here is a sample fail response:

```json
{
  "error": 1,
  "message": "Username already exists"
}
```

# Dashboard Loading

This section pertains to the API requests related to loading information to the dashboard.

## List of Semesters (GET /semesters/list)

### Request

Upon successful login, the user is redirected to the dashboard page. The semesters section fetches the semesters from the user on page load with a GET request with the following header:

- `Authorization: Bearer <JWT Token>`

### Response

The server checks if the JWT token is valid. Then, it checks if it does contain the 'uuid' parameter in its payload. It then extracts the user's UUID and checks if the UUID exists in the database, and gets all semesters from that user.
It then sends a response with the following content:

- error
- message
- semesterList: List of semester

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

```json
{
  "error": 0,
  "message": "Semesters successfully fetched",
  "semesterList": [
    {
      "semesterID": "uuidv4()",
      "semesterName": "Winter 2023"
    },
    {
      "semesterID": "uuidv4()",
      "semesterName": "Fall 2022"
    }
  ]
}
```

Here is a sample fail response:

```json
{
  "error": 1,
  "message": "User does not exist",
  "semesterList": []
}
```

## List of Courses (GET `/courses/list`)

### Request

On the dashboard page, whenever the user selects a semester, the frontend will send a GET request with the following URL search parameter:

- `semesterID=<SEMESTER_UUID>`

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

### Response

The server checks if the JWT token is valid. Then, it checks if it does contain the 'uuid' parameter in its payload. It then extracts the user's UUID and checks if the UUID exists in the database, and if the semester belongs to the user (matching foreign key). Finally, it gets all courses from that semester.
It then sends a response with the following content:

- error
- message
- courseList: List of course objects

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
| -2         | Missing required query parameters                    |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Courses successfully fetched",
  "courseList": [
    {
      "courseID": "ToJxpr77WuuQog4y",
      "courseName": "COMP 547",
      "courseCredits": 4,
      "courseDescription": "Best class ever ong"
    },
    {
      "courseID": "ZIn4H0RzJUjq7gnZ",
      "courseName": "COMP 202",
      "courseCredits": 3,
      "courseDescription": "When everything was still peaceful"
    },
    {
      "courseID": "vmXLXQziOjQuKO5r",
      "courseName": "COMP 547",
      "courseCredits": 4,
      "courseDescription": "I dropped this class instantly"
    },
    {
      "courseID": "Ofjtibul4QdNos3l",
      "courseName": "COMP 111",
      "courseCredits": 3,
      "courseDescription": "No Description"
    }
  ]
}
```

Here is a sample fail response:

```json
{
  "error": 3,
  "message": "User does not have authorized access to the specified semester",
  "course_list": []
}
```

## Get a Course and its children (GET `/courses/get`)

### Request

On the dashboard page, whenever the user selects a course, the frontend will send a GET request with the following URL search parameter:

- `courseID=<COURSE_UUID>`

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

### Response

The server checks if the JWT token is valid. Then, it checks if it does contain the 'uuid' parameter in its payload. It then extracts the user's UUID and checks if the UUID exists in the database, and if the semester belongs to the user (matching foreign key). Then, it checks if the course exists and if the user has access to that course. Finally, it gets all course items from that course.
It then sends a response with the following content:

- error
- message
- categoryList: A list of categories, each having a list of grades

The error code corresponds to 0 for a successful fetch, otherwise it failed.

| Error Code | Code Meaning                                         |
| :--------- | :--------------------------------------------------- |
| 0          | Course items successfully fetched                    |
| 1          | User does not exist                                  |
| 2          | Course does not exist                                |
| 3          | Semester does not exist                              |
| 4          | User does not have authorized access to the semester |
| 5          | Missing token                                        |
| 6          | Token decoding or verification failed                |
| 7          | Invalid token (invalid or no 'uuid' param)           |
| 8          | Expired token                                        |
| -1         | Internal server error                                |
| -2         | Missing required query parameters                    |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Course information successfully fetched",
  "categoryList": [
    {
      "categoryID": "884bbdeb-5542-47ad-88ae-5a2491f8590d",
      "categoryName": "Quizzes",
      "categoryWeight": 10,
      "categoryDescription": "these things i always fail",
      "categoryGradeList": [
        {
          "gradeID": "d64eafc2-52dd-4936-8c9e-374bd2a95175",
          "gradeName": "COMP 555 Quiz 7",
          "gradeWeight": 12.5,
          "gradePointsAct": 3,
          "gradePointsMax": 10,
          "gradeDescription": "VPN Quiz",
          "gradeDate": "2023-03-16"
        },
        {
          "gradeID": "b9388bad-f245-4d2e-b0b9-0960699795fb",
          "gradeName": "COMP 555 Quiz 6",
          "gradeWeight": 12.5,
          "gradePointsAct": 5,
          "gradePointsMax": 10,
          "gradeDescription": "Identity Quiz",
          "gradeDate": "2023-03-09"
        }
      ]
    },
    {
      "categoryID": "235f08aa-bdb8-43aa-b014-2ebf4d2d2dc9",
      "categoryName": "Projects",
      "categoryWeight": 60,
      "categoryDescription": "No Description.",
      "categoryGradeList": [
        {
          "gradeID": "5c2a2ac3-366c-4620-946d-18a56641ae70",
          "gradeName": "COMP 555 Assignment",
          "gradeWeight": 30,
          "gradePointsAct": 82,
          "gradePointsMax": 100,
          "gradeDescription": "Analysis on Ring's Privacy Compliance",
          "gradeDate": "2023-02-23"
        }
      ]
    }
  ]
}
```

Here is a sample fail response:

```json
{
  "error": 1,
  "message": "User does not exist",
  "categoryList": []
}
```

# Creating Data Items

## Create a Semester (POST `/semesters/add`)

### Request

On the dashboard page, the user can add a new semester by providing a semester name, and the frontend will send a POST request with the following content:

- candidateSemester: A semester with all required fields filled out except the ID.

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{
  "candidateSemester": {
    "semesterName": "Summer 2023"
  }
}
```

### Response

The server verifies the JWT token, and creates a new semester with the given name.
It then sends a response with the following content:

- error
- message
- newSemester: The candidate semester, as it was inserted into the database (with ID).

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
| -2         | Missing required fields                    |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Semester created successfully",
  "newSemester": {
    "semesterName": "Summer 2023",
    "semesterID": "554d2bee-30a5-4484-b095-227fc35b4071"
  }
}
```

Here is a sample fail response:

```json
{
  "error": 2,
  "message": "Semester already exists",
  "newSemester": null
}
```

## Create a Course (POST `/courses/add`)

### Request

On the dashboard page, the user can add a new course by providing a course name and description, and the number of credits, and the frontend will send a POST request with the following content:

- semesterID
- candidateCourse: A course with all required fields filled out except the ID.

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{
  "semesterID": "332458a6-8b50-432b-a6ca-f2cbeccec6fc",
  "candidateCourse": {
    "courseName": "COMP 555",
    "courseCredits": 4,
    "courseDescription": "Best class ever ong"
  }
}
```

### Response

The server verifies the JWT token and checks if a course with the same name does not already exist. Then, it creates a new course with the given name, description and number of credits. If the description is omitted, the default description is set to 'No Description.'.
It then sends a response with the following content:

- error
- message
- newCourse: The candidate course, as it was inserted into the database (with ID).

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
| -2         | Missing required fields                                        |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Course created successfully",
  "newCourse": {
    "courseName": "COMP 666",
    "courseCredits": 3,
    "courseDescription": "Third best class",
    "courseID": "d3c7e3b1-a845-4b9b-ae3b-aab89ff4257b"
  }
}
```

Here is a sample fail response:

```json
{
  "error": 4,
  "message": "Course already exists",
  "newCourse": null
}
```

## Create a Grade Category (POST `/categories/add`)

### Request

On the dashboard page, the user can add a new grade category by providing a category type, its weight and its description, and the frontend will send a POST request with the following content:

- courseID
- candidateCategory: A category with all required fields filled out except the ID.

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{
  "courseID": "1d09255a-a33b-472b-89e2-5beed929fabd",
  "candidateCategory": {
    "categoryName": "Assignments",
    "categoryWeight": 20,
    "categoryDescription": "Repeating every week"
  }
}
```

### Response

The server verifies the JWT token and checks if the course exists and belongs to the user. Then, it checks if the grade category type does not already exist. Then, it creates a new category of the given type, with the given weight and description. If the description is omitted, the default description is set to 'No Description.'.
It then sends a response with the following content:

- error
- message
- newCategory: The candidate category, as it was inserted into the database (with ID).

The error code corresponds to 0 for a successful registration, otherwise it failed.

| Error Code | Code Meaning                                                   |
| :--------- | :------------------------------------------------------------- |
| 0          | Grade category created successfully                            |
| 1          | User does not exist                                            |
| 2          | Course does not exist                                          |
| 3          | Semester does not exist                                        |
| 4          | User does not have authorized access to the specified semester |
| 5          | Grade category already exists                                  |
| 6          | Missing token                                                  |
| 7          | Token decoding or verification failed                          |
| 8          | Invalid token (invalid or no 'uuid' param)                     |
| 9          | Expired token                                                  |
| -1         | Internal server error                                          |
| -2         | Missing required fields                                        |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Grade category created successfully",
  "newCategory": {
    "categoryName": "Assignments",
    "categoryWeight": 20,
    "categoryDescription": "Repeating every week",
    "categoryID": "d16eb95f-e3b7-45f0-bede-3fca1402bceb"
  }
}
```

Here is a sample fail response:

```json
{
  "error": 5,
  "message": "Grade category already exists",
  "newCategory": null
}
```

## Create a Grade Item (POST `/grades/add`)

### Request

On the dashboard page, the user can add a new grade item by providing the item name, its weight, its mark and its total mark, its description, and its date, and the frontend will send a POST request with the following content:

- categoryID
- candidateGrade: A grade with all required fields filled out except the ID.

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{
  "categoryID": "c981a9d2-53aa-4efd-b5a4-9be99827935e",
  "candidateGrade": {
    "gradeName": "COMP 555 Quiz 7",
    "gradeWeight": 12.5,
    "gradePointsAct": 3,
    "gradePointsMax": 10,
    "gradeDescription": "VPN Quiz",
    "gradeDate": "2023-03-16"
  }
}
```

### Response

The server verifies the JWT token and checks if the semester and grade category exist and belongs to the user. Then, it checks if the grade item does not already exist. Then, it creates a new grade item of the given name, with the given weight, mark and total mark, description and date. If the description is omitted, the default description is set to 'No Description.'.
It then sends a response with the following content:

- error
- message
- newGrade: The candidate grade, as it was inserted into the database (with ID).

The error code corresponds to 0 for a successful registration, otherwise it failed.

| Error Code | Code Meaning                                                   |
| :--------- | :------------------------------------------------------------- |
| 0          | Grade item created successfully                                |
| 1          | User does not exist                                            |
| 2          | Grade category does not exist                                  |
| 3          | Course does not exist                                          |
| 4          | Semester does not exist                                        |
| 5          | User does not have authorized access to the specified semester |
| 6          | Grade item already exists                                      |
| 7          | Missing token                                                  |
| 8          | Token decoding or verification failed                          |
| 9          | Invalid token (invalid or no 'uuid' param)                     |
| 10         | Expired token                                                  |
| -1         | Internal server error                                          |
| -2         | Missing required fields                                        |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Grade item created successfully",
  "newGrade": {
    "gradeName": "COMP 555 Quiz 7",
    "gradeWeight": 12.5,
    "gradePointsAct": 3,
    "gradePointsMax": 10,
    "gradeDescription": "VPN Quiz",
    "gradeDate": "2023-03-16",
    "gradeID": "59fb5718-235e-4e72-88ee-867c7783c52d"
  }
}
```

Here is a sample fail response:

```json
{
  "error": 6,
  "message": "Grade item already exists",
  "newGrade": null
}
```

# Editing Data Items (WIP)

API requests to modify existing courses, categories or grades. In practice, the client will send an almost complete object (excluding its children), and the server should attempt to merge its (modifiable) content.

Look at the DB table for the object to see what is modifiable.

All the requests here share the almost the same server response, so I'll put it here.

Sample Response

```json
{
  "error": 0,
  "message": "Modified successfully"
}
```

Sample Error

```json
{
  "error": 1,
  "message": "Some error"
}
```

## Edit a Semester (POST `/semesters/edit`)

### Request

On the dashboard page, the user can select an existing semester and edit its information, and the frontend will send a POST request with the following content:

- modifiedSemester
  - semesterID
  - semesterName

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{
  "modifiedSemester": {
    "semesterID": "59fb5718-235e-4e72-88ee-867c7783c52d",
    "semesterName": "Summer 2023"
  }
}
```

### Response

The server verifies the JWT token and checks if the semester exists and belongs to the user. Then, it checks if the new name is valid, and updates the semester. It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful edit, otherwise it failed.

| Error Code | Code Meaning                  |
| :--------- | :---------------------------- |
| 0          | Semester updated successfully |
| 1          | Semester name already exists  |
| -1         | Internal server error         |
| -2         | Missing required fields       |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Semester deleted successfully"
}
```

Here is a sample fail response:

```json
{
  "error": 1,
  "message": "Semester name already exists"
}
```

## Edit a Course (POST `/courses/edit`)

Sample Request

```json
{
  "modifiedCourse": {
    "courseID": "59fb5718-235e-4e72-88ee-867c7783c52d",
    "courseName": "COMP 555A",
    "courseCredits": 10,
    "courseDescription": "Best class ever ong1"
  }
}
```

## Edit a Category (POST `/courses/edit`)

Sample Request

```json
{
  "modifiedCategory": {
    "categoryID": "59fb5718-235e-4e72-88ee-867c7783c52d",
    "categoryName": "Assignments",
    "categoryWeight": 20,
    "categoryDescription": "Repeating every week"
  }
}
```

## Edit a Grade (POST `/courses/edit`)

Sample Requests

```json
{
  "modifiedGrade": {
    "gradeID": "59fb5718-235e-4e72-88ee-867c7783c52d",
    "gradeName": "COMP 555 Quiz 7",
    "gradeWeight": 12.5,
    "gradePointsAct": 3,
    "gradePointsMax": 10,
    "gradeDescription": "VPN Quiz",
    "gradeDate": "2023-03-16"
  }
}
```

# Deleting Data Items

These should be really easy since all we need to do is cascade delete. The syntax here is super easy. In the payload, we include the ID of the item to delete. That's pretty much it tbh. They all have the same response.

Sample Response

```json
{
  "error": 0,
  "message": "Modified successfully"
}
```

## Delete a Semester (POST `/semesters/delete`)

### Request

On the dashboard page, the user can delete an existing semester, and the frontend will send a POST request with the following content:

- semesterID

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{ "semesterID": "59fb5718-235e-4e72-88ee-867c7783c52d" }
```

### Response

The server verifies the JWT token and checks if the semester exists and belongs to the user. Then, it deletes the given semester, along with all of its courses (deleting a course also deletes its associated categories and grade items). It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful deletion, otherwise it failed.

| Error Code | Code Meaning                  |
| :--------- | :---------------------------- |
| 0          | Semester deleted successfully |
| -1         | Internal server error         |
| -2         | Missing required fields       |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Semester deleted successfully"
}
```

Here is a sample fail response:

```json
{
  "error": -2,
  "message": "Error: missing required field"
}
```

## Delete a Course (POST `/courses/delete`)

### Request

On the dashboard page, the user can delete an existing course, and the frontend will send a POST request with the following content:

- courseID

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{ "courseID": "59fb5718-235e-4e72-88ee-867c7783c52d" }
```

### Response

The server verifies the JWT token and checks if the course exists and belongs to the user. Then, it deletes the given course, along with all of its categories (deleting a category also deletes its associated grade items). It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful deletion, otherwise it failed.

| Error Code | Code Meaning                |
| :--------- | :-------------------------- |
| 0          | Course deleted successfully |
| -1         | Internal server error       |
| -2         | Missing required fields     |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Course deleted successfully"
}
```

Here is a sample fail response:

```json
{
  "error": -2,
  "message": "Error: missing required field"
}
```

## Delete a Category (POST `/categories/delete`)

### Request

On the dashboard page, the user can delete an existing category, and the frontend will send a POST request with the following content:

- categoryID

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{ "categoryID": "59fb5718-235e-4e72-88ee-867c7783c52d" }
```

### Response

The server verifies the JWT token and checks if the category exists and belongs to the user. Then, it deletes the given category, along with all of its associated grade items. It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful deletion, otherwise it failed.

| Error Code | Code Meaning                  |
| :--------- | :---------------------------- |
| 0          | Category deleted successfully |
| -1         | Internal server error         |
| -2         | Missing required fields       |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Category deleted successfully"
}
```

Here is a sample fail response:

```json
{
  "error": -2,
  "message": "Error: missing required field"
}
```

## Delete a Grade (POST `/grades/delete`)

### Request

On the dashboard page, the user can delete an existing grade item, and the frontend will send a POST request with the following content:

- categoryID

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

Here is a sample request:

```json
{ "gradeID": "59fb5718-235e-4e72-88ee-867c7783c52d" }
```

### Response

The server verifies the JWT token and checks if the grade item exists and belongs to the user. Then, it deletes the given grade item. It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful deletion, otherwise it failed.

| Error Code | Code Meaning               |
| :--------- | :------------------------- |
| 0          | Grade deleted successfully |
| -1         | Internal server error      |
| -2         | Missing required fields    |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Grade deleted successfully"
}
```

Here is a sample fail response:

```json
{
  "error": -2,
  "message": "Error: missing required field"
}
```

# Account Administration

## Edit Account Information (POST `/account/edit/info`)

Passwords are sent in a separate request for added security

**We return a new token since we're using the token's content to know the username and other info!** The client will replace the current token with the new one, if appropriate.

Sample Request

```json
{
  "username": "JDoe",
  "email": "jodoe@email.com"
}
```

Sample Response

```json
{
  "error": 0,
  "message": "Updated successfully",
  "token": "hfuiweuifyuifyuiregyureguiguigygugsuiegh"
}
```

Sample Error

```json
{
  "error": 1,
  "message": "Some error",
  "token": null
}
```

## Edit Account Password (POST `/account/edit/password`)

Sample Request

```json
{
    "oldPassword": "1234",
    "newPassword": "4321"
}
```

Sample Response

```json
{
  "error": 0,
  "message": "Updated successfully"
}
```

Sample Error

```json
{
  "error": 1,
  "message": "Some error"
}
```

## Request Data Download (GET `/account/download`)

No URL params

Response should prompt browser to download.

## Delete Account (POST `/account/delete`)

### Request

On the Account Settings page, the user can delete their account, and the frontend will send a POST request (with no content).

The JWT token is included in the header as follows:

- `Authorization: Bearer <JWT Token>`

### Response

The server verifies the JWT token. Then, it deletes the user's account. It then sends a response with the following content:

- error
- message

The error code corresponds to 0 for a successful deletion, otherwise it failed.

| Error Code | Code Meaning                     |
| :--------- | :------------------------------- |
| 0          | Account deleted successfully     |
| -1         | Internal server error            |
| -2         | Missing required query parameter |

Here is a sample success response:

```json
{
  "error": 0,
  "message": "Account deleted successfully"
}
```

Here is a sample fail response:

```json
{
  "error": -2,
  "message": "Error: missing required query parameter"
}
```

# Static resources

## Compiled Website (GET `/`)

The client can be compiled, and its contents placed inside of the server's `public` folder, where it will be served by Express at route `/` (no need to juggle two ports).

## Static Resources (GET `/static/`)

We may let Express serve some static resources (outside of the client's compiled output) such as the terms of conditions, privacy policy, etc.

### Privacy Policy (`GET /static/privacy`)

Sample Response

```json
{
  "type": "markdown",
  "content": "#Lorem Ipsum"
}
```

### Terms of Use (`GET /static/terms`)

Sample Response

```json
{
  "type": "markdown",
  "content": "#Lorem Ipsum"
}
```