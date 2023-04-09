// Utilities
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../database.db"));
db.get("PRAGMA foreign_keys = ON");
// Routing
const express = require("express");
const router = express.Router();
// Verification
const ownerCheck = require("../middlewares/ownerCheck");

/**
 * This file contains API requests (apiURL/semesters/x) that allow adding
 * (/add), modifying (/edit) or retrieving a list (/list) of semesters.
 *
 * For all routes here:
 * 
 * Authentication required (JWT middleware ran before arriving here).
 * - Assume all requests will have valid tokens (bad ones don't get past MW).
 * - Assume req.auth exists and contains valid token payload
 * - Assume the user exists
 */

// apiURL/semesters/list GET request
router.get("/list", (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */

  const userID = req.auth.uuid;

  // Get all semesters for that user
  db.all("SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?", [userID], (err, rows) => {
    if (err) {
      console.error("Error fetching semesters:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        semesterList: [],
      });
      return;
    }

    // Create semester list
    const semesterList = rows.map((row) => ({
      semesterID: row.uuid,
      semesterName: row.semester_name,
    }));

    // Success response
    res.json({
      error: 0,
      message: "Semesters successfully fetched",
      semesterList: semesterList,
    });
  });
});

// apiURL/semesters/add POST request
router.post("/add", (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */

  // Verify request body
  let candidateSemester, semesterName;
  try {
    ({ candidateSemester } = req.body);
    ({ semesterName } = candidateSemester);
    if (!semesterName) res.sendStatus(400);
  } catch (err) {
    res.sendStatus(400);
    return;
  }

  const userID = req.auth.uuid;

  // Check that semester does not already exist
  db.get("SELECT * FROM semesters WHERE semester_name = ? AND user_uuid = ?", [semesterName, userID], (err, semesterRow) => {
    if (err) {
      console.error("Error selecting semester:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        newSemester: null,
      });
      return;
    }

    if (semesterRow) {
      res.json({
        error: 2,
        message: "Semester already exists",
        newSemester: null,
      });
      return;
    }

    // SQL query
    const newSemesterID = uuidv4();
    db.run("INSERT INTO semesters (uuid, user_uuid, semester_name) VALUES (?, ?, ?)", [newSemesterID, userID, semesterName], (err) => {
      if (err) {
        console.error("Error inserting semester:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
        });
        return;
      } else {
        res.status(200).json({
          error: 0,
          message: "Semester created successfully",
          newSemester: { ...candidateSemester, semesterID: newSemesterID },
        });
      }
    });
  });
});

const isOwnerMWEdit = ownerCheck.getMW((res) => res.body.modifiedSemester.semesterID, ownerCheck.sql.sem);
router.post("/edit", isOwnerMWEdit, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  */

  // Potentially only those that changed are sent over, so expect some of these to be undefined? idk
  //TODO
  res.sendStatus(501);
});

const isOwnerMWDel = ownerCheck.getMW((res) => res.body.semesterID, ownerCheck.sql.sem);
router.post("/delete", isOwnerMWDel, (req, res) => {
  const { semesterID } = req.body;
  if (!semesterID) {
    res.status(400).json({
      error: -2,
      message: "Error: missing required field",
    });
  }

  // Delete the semester
  db.run("DELETE FROM semesters WHERE uuid = ?", [semesterID], (err) => {
    if (err) {
      console.log("Error deleting semester:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
      return;
    } else {
      res.status(200).json({
        error: 0,
        message: "Semester deleted successfully",
      });
    }
  });
});

module.exports = router;
