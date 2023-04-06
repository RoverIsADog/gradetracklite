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
 * This file contains API requests (apiURL/categories/x) that allow adding
 * (/add) and modifying (/edit) a category.
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

// apiURL/categories/add POST request
const isOwnerMWAdd = ownerCheck.getMW((req) => req.body.courseID, ownerCheck.sql.course);
router.post("/add", isOwnerMWAdd, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWAdd
  - Parent course exists, is owned by user
  */

  // Get request body
  const { courseID, candidateCategory } = req.body;
  const { categoryName, categoryWeight, categoryDescription } = candidateCategory;

  // Check if request body contains the required fields
  if (!courseID || !categoryName || !categoryWeight) {
    res.status(400).json({
      error: -2,
      message: "Missing required fields",
      newCategory: null,
    });
    return;
  }

  // Decode the JWT token (redundant, removed), we don't even need the userID anymore
  // Check that user exists (redundant, removed)
  // Check that course exists (redundant, removed)
  // Check that semester exists (redundant, removed)
  // Check that user is authorized to access the specified semester (redundant, removed)

  // Check that grade category does not already exist
  db.get("SELECT * FROM grade_categories WHERE course_uuid = ? AND category_type = ?", [courseID, categoryName], (err, categoryRow) => {
    if (err) {
      console.error("Error selecting category:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        newCategory: null,
      });
      return;
    }

    if (categoryRow) {
      res.json({
        error: 5,
        message: "Grade category already exists",
        newCategory: null,
      });
      return;
    }

    // SQL query
    const newCategoryID = uuidv4();
    db.run("INSERT INTO grade_categories (uuid, course_uuid, category_type, category_weight, category_description) VALUES (?, ?, ?, ?, ?)", [newCategoryID, courseID, categoryName, categoryWeight, categoryDescription || "No Description."], (err) => {
      if (err) {
        console.error("Error inserting grade category:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          newCategory: null,
        });
        return;
      } else {
        res.status(200).json({
          error: 0,
          message: "Grade category created successfully",
          newCategory: { ...candidateCategory, categoryID: newCategoryID },
        });
      }
    });
  });
});

const isOwnerMWEdit = ownerCheck.getMW((req) => req.body.modifiedCategory.categoryID, ownerCheck.sql.cat);
router.post("/edit", isOwnerMWEdit, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWEdit
  - Target category exists, is owned by user
  */

  //TODO
  res.sendStatus(501);
});

const isOwnerMWDel = ownerCheck.getMW((req) => req.body.categoryID, ownerCheck.sql.cat);
router.post("/delete", isOwnerMWDel, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWDel
  - Target category exists, is owned by user
  */

  //TODO
  res.sendStatus(501);
});

module.exports = router;
