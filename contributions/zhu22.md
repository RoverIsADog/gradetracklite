# Contributions

This document states the contributions by Zi Chen Hu (@zhu22 - 260931572).

## Assigned Tasks

I was assigned the following tasks for the project:

- [Database](#database)
- [Front-End](#front-end)
- [Back-End](#back-end)
- [Deliverables](#deliverables)

## Database

I designed the database schema for the application with @yzhou131.

I set up the SQLite database with the local `database.db` file to store and manage data that needs to be persisted and queried over time. Then, I created all the tables required for our application.
## Front-End

I helped @swang297 to implement some elements in the Login and Registration pages (using React) in order to interact with the back-end by sending and receiving requests and updating the page accordingly.

I collaborated with @yzhou131 to ensure seamless integration of the front-end and back-end components.

## Back-End

I was responsible for designing and implementing the database schema and developing the the server-side application, and creating the API routes and associated handler functions. To do so, @yzhou131 helped me with the middleware integrations for authentication and error handling (verifying the JWT tokens and whether or not the user has access to view, modify and/or delete a certain element).

I set up the `server.js` file to create the entry point for our application's back-end and to listen for incoming requests. Then, I creates the API routes into several files in the `/server/routes/` folder to handle the different incoming API requests by category.

In these files, I developed the database queries using SQL to retrieve, update and delete data from the database, and to add data to the database. Finally, I also implemented authentication and authorization mechanisms to ensure the protection of user data.

## Deliverables

I wrote up the Architectural Description and Report deliverables along with @swang297 and @yzhou131.

I helped write Requirements.md, specifically for the [Sample Systems Section](../Requirements.md#sample-systems) and the requirements sections ([Functional Requirements](../Requirements.md#functional-requirements) and [Privacy Requirements](../Requirements.md#functional-requirements)).
