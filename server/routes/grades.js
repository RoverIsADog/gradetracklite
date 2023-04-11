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
const ownerCheck = require("../middlewares/ownerCheck");
const router = express.Router();

/**
 * This file contains API requests (apiURL/grades/x) that allow adding
 * (/add) and modifying (/edit) a grade.
 *
 * There is no /list or /get here because that's handled by /courses/get.
 *
 * For all routes here:
 *
 * Authentication required (JWT middleware ran before arriving here).
 * - Assume all requests will have valid tokens (bad ones don't get past MW).
 * - Assume req.auth exists and contains valid token payload.
 * - Assume the user exists
 */

// apiURL/grades/add POST request
const isOwnerMWAdd = ownerCheck.getMW((req) => req.body.categoryID, ownerCheck.sql.cat);
router.post("/add", isOwnerMWAdd, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWAdd
  - Parent category exists, is owned by user
  */

  // Get request body
  const { categoryID, candidateGrade } = req.body;
  const { gradeName, gradeWeight, gradePointsAct, gradePointsMax, gradeDescription, gradeDate } = candidateGrade;

  // Check if request body contains the required fields
  if (!categoryID || !gradeName || !gradeWeight || !gradePointsAct || !gradePointsMax || !gradeDate) {
    res.status(400).json({
      error: -2,
      message: "Missing required fields",
      newGrade: null,
    });
    return;
  }

  // Get JWT token (redundant, removed), we don't even need the userID anymore
  // Check that user exists (redundant, removed)
  // Check that grade category exists (redundant, removed)
  // Check that course exists (redundant, removed)
  // Check that semester exists (redundant, removed)
  // Check that user is authorized to access the specified semester (redundant, removed)

  // Check that grade item does not already exist
  db.get("SELECT * FROM grade_items WHERE category_uuid = ? AND item_name = ?", [categoryID, gradeName], (err, itemRow) => {
    if (err) {
      console.error("Error selecting grade item:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        newGrade: null,
      });
      return;
    }

    if (itemRow) {
      res.json({
        error: 6,
        message: "Grade item already exists",
        newGrade: null,
      });
      return;
    }

    // SQL query
    const newGradeID = uuidv4();
    db.run("INSERT INTO grade_items (uuid, category_uuid, item_name, item_weight, item_mark, item_total, item_description, item_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [newGradeID, categoryID, gradeName, gradeWeight, gradePointsAct, gradePointsMax, gradeDescription || "No Description.", gradeDate], (err) => {
      if (err) {
        console.error("Error inserting grade item:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          newGrade: null,
        });
        return;
      } else {
        res.status(200).json({
          error: 0,
          message: "Grade item created successfully",
          newGrade: { ...candidateGrade, gradeID: newGradeID },
        });
      }
    });
  });
});

const isOwnerMWEdit = ownerCheck.getMW((req) => req.body.modifiedGrade.gradeID, ownerCheck.sql.grade);
router.post("/edit", isOwnerMWEdit, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWEdit
  - Target grade exists, is owned by user
  */

  //TODO
  res.sendStatus(501);
});

const isOwnerMWDel = ownerCheck.getMW((req) => req.body.gradeID, ownerCheck.sql.grade);
router.post("/delete", isOwnerMWDel, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWDel
  - Target grade exists, is owned by user
  */
  const { gradeID } = req.body;
  if (!gradeID) {
    res.status(400).json({
      error: -2,
      message: "Error: missing required field",
    });
  }


  // Delete the course
  db.run("DELETE FROM grade_items WHERE uuid = ?", [gradeID], (err) => {
    if (err) {
      console.log("Error deleting grade:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
      return;
    } else {
      res.status(200).json({
        error: 0,
        message: "Grade deleted successfully",
      });
    }
  });
});

module.exports = router;
