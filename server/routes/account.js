// Utilities
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../../data/database.db"));
db.get("PRAGMA foreign_keys = ON");
// Routing
const express = require("express");
const router = express.Router();

/**
 * This file contains API requests (apiURL/account/x) that allow doing
 * account-related queries such as modifying info (/edit/info), changing
 * passwords (/edit/password), downloading data (/download), and deleting
 * the account (/delete).
 *
 * Authentication required (JWT middleware ran before arriving here).
 * - Assume all requests will have valid tokens (bad ones don't get past MW).
 * - Assume req.auth exists and contains valid token payload.
 * - Assume the user exists
 */

/**
 * This request is for changing account information, not the password.
 * Similar to apiURL/auth/register, we're provided account information.
 * The server will merge the new information into the database.
 *
 * Unsure if fields that haven't been modified are sent aswell.
 *
 * This request returns a fresh new token because the frontend uses the
 * username contained in the token's payload to display the user's profile
 */
router.post("/edit/info", (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */

  const newUsername = req.body.username;

  if (!newUsername) {
    res.sendStatus(400).json({
      error: -2,
      message: "Error: missing required field",
      token: null,
    });
    return;
  }

  // Check if username is the same
  if (newUsername === req.auth.username) {
    res.json({
      error: 0,
      message: "Account information updated successfully",
      token: null,
    });
    return;
  }

  // Check if username exists
  db.get(`SELECT * FROM users WHERE username = ?`,
  [newUsername], (err, row) => {
    if (err) {
      console.error("Error updating account information:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        token: null,
      });
      return;
    }

    if (row) {
      res.status(200).json({
        error: 1,
        message: "Error: invalid username",
        token: null,
      });
      return;
    }

    db.run(`UPDATE users SET username = ? WHERE uuid = ?`,
    [newUsername, req.auth.uuid], (err) => {
      if (err) {
        console.error("Error updating account information:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          token: null,
        });
      } else {
        const token = jwt.sign(
        {
          uuid: req.auth.uuid,
          username: newUsername,
          email: "",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
        res.json({
          error: 0,
          message: "Account information updated successfully",
          token: token,
        });
      }
    });
  });
});

/**
 * This request is for changing the account's password.
 */
router.post("/edit/password", async (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.sendStatus(400).json({
      error: -2,
      message: "Error: missing required field",
    });
    return;
  }

  // Get user
  db.get(`SELECT * FROM users WHERE uuid = ?`,
  [req.auth.uuid], async (err, row) => {
    if (err) {
      console.error("Error updating password:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
      return;
    }

    if (!row) {
      res.status(200).json({
        error: 1,
        message: "Error: user not found",
      });
      return;
    }

    // Validate password
    const match = await bcrypt.compare(oldPassword, row.password);
    if (match) {
      // Salt and hash the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      db.run(`UPDATE users SET password = ? WHERE uuid = ?`,
      [hashedPassword, req.auth.uuid], (err) => {
        if (err) {
          console.error("Error updating password:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
          });
        } else {
          res.json({
            error: 0,
            message: "Password updated successfully",
          });
        }
      });
    } else {
      res.status(200).json({
        error: 2,
        message: "Error: invalid password",
      });
      return;
    }
  });
});

const semestersSQL = `
SELECT uuid, semester_name AS name FROM semesters WHERE user_uuid = ?;
`;

const courseSQL = `
WITH owned_semesters(uuid, semester_name) AS (
  SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
)
SELECT c.semester_uuid AS parent_semester, c.uuid, c.course_name AS name, c.course_credits as credits, c.course_description as description
FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
`;

const categorySQL = `
WITH owned_semesters(uuid, name) AS (
	SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
),
owned_courses(uuid, name) AS (
	SELECT c.uuid, c.course_name
	FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
)
SELECT cat.course_uuid AS parent_course, cat.uuid, cat.category_type AS name, cat.category_weight AS weight, cat.category_description AS description
FROM owned_courses c JOIN grade_categories cat ON c.uuid = cat.course_uuid
`;

const gradeSQL = `
WITH owned_semesters(uuid, name) AS (
  SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?
),
owned_courses(uuid, name) AS (
  SELECT c.uuid, c.course_name
  FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
),
owned_categories(uuid, name) AS (
  SELECT cat.uuid, cat.category_type
  FROM owned_courses c JOIN grade_categories cat ON c.uuid = cat.course_uuid
)
SELECT g.category_uuid AS parent_category, g.uuid, g.item_name AS name, g.item_weight AS weight, g.item_mark AS points, g.item_total AS max_points, g.item_description AS description
FROM owned_categories c JOIN grade_items g ON c.uuid = g.category_uuid
`;

/**
 * This request is for downloading all the user's data in a JSON format.
 */
router.get("/download", (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */
  
  const userID = req.auth.uuid;

  const sendError = () => {
    res.sendStatus(500);
  }
  
  let finalResponse = {
    uuid: req.auth.uuid,
    username: req.auth.username
  };
  db.all(semestersSQL, userID, (err, semRows) => {
    if (err) {
      console.error(err);
      sendError();
      return;
    }
    finalResponse.semesters = semRows;

    db.all(courseSQL, userID, (err, courseRows) => {
      if (err) {
        console.error(err);
        sendError();
        return;
      }
      finalResponse.courses = courseRows;

      db.all(categorySQL, userID, (err, catRows) => {
        if (err) {
          console.error(err);
          sendError();
          return;
        }

        finalResponse.categories = catRows;

        db.all(gradeSQL, userID, (err, gradeRows) => {
          if (err) {
            console.error(err);
            sendError();
            return;
          }

          finalResponse.grades = gradeRows;
          res.json(finalResponse);

        })
      })
    })
  });
});

/**
 * This request is for deleting the user's account and all data
 * associated with it.
 */
router.post("/delete", (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */
  const { auth } = req.auth;
  if (!auth) {
    res.status(400).json({
      error: -2,
      message: "Missing required query parameter",
    });
  }
  
  const { userID } = auth.uuid;
  if (!userID) {
    res.status(400).json({
      error: -2,
      message: "Missing required query parameter",
    });
  }

  // Delete the semester
  db.run("DELETE FROM users WHERE uuid = ?", [userID], (err) => {
    if (err) {
      console.log("Error deleting user:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
      return;
    } else {
      res.status(200).json({
        error: 0,
        message: "Account deleted successfully",
      });
    }
  });
});

module.exports = router;
