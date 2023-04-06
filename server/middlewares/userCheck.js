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
 * actually exists. This middleware should be used to protect routes
 * requiring an actual user to perform (anything outside of auth and static).
 *
 * For most intents and purposes, it should be run right after the
 * JWTMiddleware since all routes requiring users also need to validate
 * the token. (not before because we want JWTMiddleware to decode the
 * token, which contains the user UUID).
 *
 * By default, the MW gets the user UUID from `req.auth.uuid` since we
 * assume this MW is run right after the JWTMiddleware, and JWTMiddleware
 * will decode the token into there. Optionally, a function
 * `userIDGetter(req) => string` to extract the UUID from the request can
 * be provided.
 *
 * @param {((req: express.Request) => string) | null} userIDGetter
 * OPTIONAL. Function to get the user's UUID from the request
 * @returns Middleware to do the above mentioned checks
 */
function getUserExistsMW(userIDGetter = null) {
  const sqlQuery = `SELECT COUNT(1) as "count" FROM users WHERE uuid = ?`;
  return (req, res, next) => {
    let userID;
    try {
      userID = userIDGetter ? userIDGetter(req) : req.auth.uuid;
    } catch {
      // This shouldn't happen since we assume JWTMiddleware ran before this...
      console.log("UserCheckMW: Unable to get user ID");
      res.sendStatus(400);
      return;
    }
    /* Because all DB queries are asynchronous and we can't use await inside
    Express middlewares, we proceed on the middleware chain or fail the request by
    calling next() from within the DB request's callback. */
    db.get(sqlQuery, [userID], (err, row) => {
      if (err) res.status(500).send("Database error.");

      try {
        // Safegard from undefined access
        if (row.count === 1) {
          console.log("User existence verified");
          next();
        } else {
          console.error("Failed to verify user existence!");
          res.status(401).send("You do not exist");
        }
      } catch (err) {
        res.status(500);
      }
    });
  };
}

module.exports = {
  getMW: getUserExistsMW,
};
