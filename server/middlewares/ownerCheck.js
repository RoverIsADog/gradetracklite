// @ts-check
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../database.db"));
db.get("PRAGMA foreign_keys = ON");
// Routing
const express = require("express");

/**
 * Function to create a middleware that checks whether the request's user
 * owns the requested resource. It returns a 401 in the event they do not.
 *
 * __This middleware also 401's requests if either the user doesn't exist
 * or the resource doesn't exist__, although this is more a byproduct of
 * SQL than an indended feature.
 *
 * This middleware requires `resIDGetter(req) => string`, a function that
 * extracts the desired resource's UUID from the request since it may be
 * different for each request type.
 *
 * A `sqlQuery` that takes a user's UUID and the resource's UUID and
 * returns a single-row table with 1 column named `count` (provided in
 * the module DON'T WRITE YOUR OWN at `module.sql.xxxx`):
 *  * `0`: User does not own the resource
 *  * `1`: User does own the resource OR THE RESOURCE DOES NOT EXIST.
 *         We do not distinguish.
 *
 * By default, the MW gets the user UUID from `req.auth.uuid` since all
 * protected paths require a token, and JWTMiddleware will decode the token
 * into there. Optionally, a function `userIDGetter(req) => string` to
 * extract the UUID from the request can be provided.
 * 
 * If this MW is successful:
 * * The user owns the desired resource
 * * The user and the resource both exist
 *
 * @param {(req: express.Request) => string} resIDGetter
 * Function to get the resource from the request
 * @param {string} sqlQuery
 * SQL query that returns one row with 1 column named
 * @param {((req: express.Request) => string) | null} userIDGetter
 * OPTIONAL. Function to get the user's UUID from the request
 * @returns Middleware to do the above mentioned checks
 */
function getOwnerCheckMW(resIDGetter, sqlQuery, userIDGetter = null) {
  if (!resIDGetter || !sqlQuery) throw Error("I'm being called with missing params");
  return (req, res, next) => {
    let userID, resID;
    try {
      userID = userIDGetter ? userIDGetter(req) : req.auth.uuid;
      resID = resIDGetter(req);
      if (!userID || !resID) throw Error();
    } catch (err) {
      console.log("ResOwner: Failed to get either userID or resID");
      res.sendStatus(400);
      return;
    }

    /* Because all DB queries are asynchronous and we can't use await inside
    Express middlewares, we proceed on the middleware chain or fail the request by
    calling next() from within the DB request's callback. */
    db.get(sqlQuery, [userID, resID], (err, row) => {
      if (err) res.status(500).send("Database error.");

      try {
        // Safegard from undefined access
        if (row.count === 1) {
          console.log("Requested resource ownership verified");
          next();
        } else {
          console.error("Failed to verify ownership to requested resource");
          res.status(401).send("You do not have access to the requested resource");
        }
      } catch (err) {
        res.status(500);
      }
    });
  };
}

const sqlSemesterCheck = `
/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
  SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
)
/* Finally, check if the user actually has access to the semesters */
SELECT COUNT(1) AS "count" FROM owned_semesters WHERE uuid = ?;
`;

const sqlCourseCheck = `
/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
  SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
),
/* Join to get owned courses */
owned_courses(uuid, name) AS (
  SELECT c.uuid, c.course_name
  FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
)
/* Finally, check if the user actually has access to the course */
SELECT COUNT(1) AS "count" FROM owned_courses WHERE uuid = ?;
`;

const sqlCategoryCheck = `
/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
	SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
),
/* Join to get owned courses */
owned_courses(uuid, name) AS (
	SELECT c.uuid, c.course_name
	FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
),
/* Join to get owned categories */
owned_categories(uuid, name) AS (
	SELECT cat.uuid, cat.category_type
	FROM owned_courses c JOIN grade_categories cat ON c.uuid = cat.course_uuid
)
/* Finally, check if the user actually has access to the category */
SELECT COUNT(1) AS "count" FROM owned_categories WHERE uuid = ?;
`;

const sqlGradeCheck = `
/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
  SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
),
/* Join to get owned courses */
owned_courses(uuid, name) AS (
  SELECT c.uuid, c.course_name
  FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
),
/* Join to get owned categories */
owned_categories(uuid, name) AS (
  SELECT cat.uuid, cat.category_type
  FROM owned_courses c JOIN grade_categories cat ON c.uuid = cat.course_uuid
),
/* Join to get owned grades */
owned_grades(uuid, name) AS (
  SELECT g.uuid, g.item_name
  FROM owned_categories c JOIN grade_items g ON c.uuid = g.category_uuid
)
/* Finally, check if the user actually has access to the grade */
SELECT COUNT(1) AS "count" FROM owned_grades WHERE uuid = ?;
`;

module.exports = {
  getMW: getOwnerCheckMW,
  sql: {
    sem: sqlSemesterCheck,
    course: sqlCourseCheck,
    cat: sqlCategoryCheck,
    grade: sqlGradeCheck,
  },
};
