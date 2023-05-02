// @ts-check
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");

/* ######################### CONFIGURATION CHECKING #########################
Don't let the server start if anything is missing. The goal is to not
have to depend on environment variables or config files pas this point,
if possible.
*/
require("dotenv").config({ path: "conf/.env" }); // Loads .env into process.env.
let { HTTPS_ENABLED: HTTPS_ENABLED_STR, PORT: PORT_STR, SSL_PRIVATE_KEY, SSL_CERTIFICATE, JWT_SECRET } = process.env;
let PORT = Number(PORT_STR); // It's ok if it NaNs since we check right after
let HTTPS_ENABLED = HTTPS_ENABLED_STR === "true";

// HTTPS error checking
if (!HTTPS_ENABLED) {
  console.warn("HTTPS is disabled! We strongly recommend using HTTPS to encrypt traffic in transit.");
} else {
  console.log("HTTPS is enabled!");
  if (!SSL_PRIVATE_KEY || !SSL_CERTIFICATE) {
    console.error("Your have enabled HTTPS. You must specify the location of your private key and certificate in environment variables SSL_PRIVATE_KEY and SSL_CERTIFICATE.");
    process.exit(0); // Exit application
  }
  if (!fs.existsSync(path.join(__dirname, SSL_PRIVATE_KEY)) || !fs.existsSync(path.join(__dirname, SSL_CERTIFICATE))) {
    console.error("Either the SSL key or certificate could not be found");
    process.exit(0);
  }
}

// Port selection
if (!PORT) {
  console.log("No port specified, defaulting to port 8000");
  PORT = 8000;
}
console.log("GradeTrackLite server starting on port " + PORT);

// JWT Token Related
if (!JWT_SECRET) {
  console.error("Please specify a secret to sign JWT tokens with in the environment variable JWT_SECRET");
  process.exit(0);
}

/* ######################### Express/DB init #########################
Initialise express and the database (create tables if DNE). Both objects
remain in this file. Don't actually execute on any routes in this file;
routers are a thing for a reason. (exception for static website).

The database object doesn't need to be passed to the other files since
SQLite is (actually) serverless and we can just import it at every file
when required.
*/
const app = express();
const db = new sqlite3.Database(path.join(__dirname, "database.db"));
db.get("PRAGMA foreign_keys = ON");

/* FIXME cors is redundant now that we're hosting the website on the
same server (the whole point is to bypass same-origin restrictions,
but we're actually from the same origin now so there's no point).

Even when removed, it still works if we're letting the client dev server
proxy requests to us. */
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// app.use(cors(corsOptions));
app.use(bodyParser.json());

// Create the users table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    uuid TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT
  );`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table created");
    }
  }
);

// Create the semesters table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS semesters (
    uuid TEXT PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    semester_name TEXT NOT NULL,
    FOREIGN KEY(user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
  );`,
  (err) => {
    if (err) {
      console.error("Error creating semesters table:", err);
    } else {
      console.log("Semesters table created");
    }
  }
);

// Create the courses table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS courses (
    uuid TEXT PRIMARY KEY,
    semester_uuid TEXT NOT NULL,
    course_name TEXT NOT NULL,
    course_credits INTEGER NOT NULL,
    course_description TEXT,
    FOREIGN KEY(semester_uuid) REFERENCES semesters(uuid) ON DELETE CASCADE
  );`,
  (err) => {
    if (err) {
      console.error("Error creating courses table:", err);
    } else {
      console.log("Courses table created");
    }
  }
);

// Create the grade_categories table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS grade_categories (
    uuid TEXT PRIMARY KEY,
    course_uuid TEXT NOT NULL,
    category_type TEXT NOT NULL,
    category_weight INTEGER NOT NULL,
    category_description TEXT,
    FOREIGN KEY(course_uuid) REFERENCES courses(uuid) ON DELETE CASCADE
  );`,
  (err) => {
    if (err) {
      console.error("Error creating grade_categories table:", err);
    } else {
      console.log("grade_categories table created");
    }
  }
);

// Create the grade_items table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS grade_items (
    uuid TEXT PRIMARY KEY,
    category_uuid TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_weight INTEGER NOT NULL,
    item_mark INTEGER NOT NULL,
    item_total INTEGER NOT NULL,
    item_description TEXT,
    item_date TEXT NOT NULL,
    FOREIGN KEY (category_uuid) REFERENCES grade_categories(uuid) ON DELETE CASCADE
  );`,
  (err) => {
    if (err) {
      console.error("Error creating grade_items table:", err);
    } else {
      console.log("grade_items table created");
    }
  }
);

/* ######################### MIDDLEWARES #########################
Declare and add middlewares to the chain here, before moving onto routes.
*/

// For development, the first middleware in the chain takes requests
// and prints some info about them.
app.use((req, res, next) => {
  // FIXME debug only.
  if (req.originalUrl.startsWith("/api")) {
    console.log("\nIncoming request to " + req.originalUrl);
    console.log(req.body);
  }
  next();
});

/*
Then, go through the JWT token verification middleware before
proceeding (if the route requires being logged in). If not, the
JWT middleware is not applied.

This rejects invalid tokens before we proceed to routes. Let the
JWTErrorHandler return the status instead of the JWT middleware
because it returns the error (contains stack trace exposing
the server's file structure).

If success, stores decoded token content in --> req.auth <--
*/
const { expressjwt } = require("express-jwt");
const jwtMiddleware = expressjwt({ secret: () => JWT_SECRET, algorithms: ["HS256"] });
const jwtErrorHandler = function(err, req, res, next) { // Only invoked if errors. Doesn't run otherwise
  if (err.name === "UnauthorizedError") {
    console.error("Invalid token");
    res.status(401).send("invalid token");
    return;
  }
  next();
};
const jwtPayloadVerifier = function (req, res, next) {
  // Modify this if the token payload is modified (email opt)
  if (!req.auth || !req.auth.uuid || !req.auth.username) {
    console.error("Token valid but malformed payload");
    res.status(401).send("malformed token");
    return;
  }
  next();
}

/* For all requests needing to be logged in, we must check for a situation
where the request goes past the JWTMiddleware since it's valid, but the
account got deleted. So, use custom userCheck middleware. */
const userCheck = require("./middlewares/userCheck");
const userCheckMW = userCheck.getMW();

// Bundling all MW for protected routes to reduce spam
const authMiddlewares = [jwtMiddleware, jwtErrorHandler, jwtPayloadVerifier, userCheckMW];

/* ######################### ROUTES #########################
Separate all API routes into their own router. Grouped by what 
resource or functionality the request concerns. Ex: /semesters/ contains
all the requests for getting a list, adding, modifying, and deleting.

JWT token check middleware only applies to protected paths (account settings
or accessing resources)
*/
const authRouter = require("./routes/authentication");
app.use("/api/v1/auth", authRouter); // No token required

const semesterRouter = require("./routes/semesters");
app.use("/api/v1/semesters", authMiddlewares, semesterRouter);

const courseRouter = require("./routes/courses");
app.use("/api/v1/courses", authMiddlewares, courseRouter);

const categoryRouter = require("./routes/categories");
app.use("/api/v1/categories", authMiddlewares, categoryRouter);

const gradeRouter = require("./routes/grades");
app.use("/api/v1/grades", authMiddlewares, gradeRouter);

const docRouter = require("./routes/docs");
app.use("/api/v1/docs", docRouter); // No token required

const accountRouter = require("./routes/account");
app.use("/api/v1/account", authMiddlewares, accountRouter);

/* ######################### WEBAPP #########################
Serve static webpages (the webapp) from "/"
THIS MUST REMAIN AFTER THE OTHER ROUTES OTHERWISE THE * WILL
MATCH OTHER ROUTES!!!! */
app.use(express.static(path.join(__dirname, "public")));
app.get("/*", function (req, res, next) {
  if (req.originalUrl.startsWith("/api")) next();
  // This is to allow react path reloads (client navigation).
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ######################### HTTPS #########################
Finally, start up server in either HTTP or HTTPS depending on
the configuration. Nothing should be missing to successfully start
the server here as we checked at the very top. The only crash here
should be that the key or certification are invalid. */
if (HTTPS_ENABLED) {
  https
    .createServer(
      {
        // @ts-ignore
        key: fs.readFileSync(path.join(__dirname, SSL_PRIVATE_KEY)),
        // @ts-ignore
        cert: fs.readFileSync(path.join(__dirname, SSL_CERTIFICATE)),
      },
      app
    )
    .listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
} else {
  http.createServer(app).listen(PORT, () => console.log(`HTTP server running on port ${PORT}`));
}

console.log("SERVER READY!");
