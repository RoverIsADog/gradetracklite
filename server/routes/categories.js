// Utilities
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../database.db"));
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
 * Authentication required (JWT middleware ran before arriving here).
 * Assume all requests will have valid tokens (bad ones don't get past MW).
 * Assume req.auth exists and contains token payload.
 */

// apiURL/categories/add POST request
router.post("/add", (req, res) => {
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

  // Get JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      error: 6,
      message: "Invalid or missing token",
      newCategory: null,
    });
    return;
  }

  // Decode the JWT token
  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET || "not_having_a_secret_key_is_bad_bad_bad_smh");
  } catch (err) {
    // Check if token is expired
    try {
      const { exp } = jwt.decode(token);
      if (exp * 1000 < Date.now()) {
        res.status(401).json({
          error: 9,
          message: "Expired token",
          newCategory: null,
        });
        return;
      }
    } catch (err) {
      res.status(401).json({
        error: 7,
        message: "Invalid or missing token",
        newCategory: null,
      });
      return;
    }
    res.status(401).json({
      error: 7,
      message: "Invalid or missing token",
      newCategory: null,
    });
    return;
  }

  // Get the user's UUID from the JWT token
  if (!decodedToken || !decodedToken.uuid) {
    res.status(401).json({
      error: 8,
      message: "Invalid or missing token",
      newCategory: null,
    });
    return;
  }

  const userUuid = decodedToken.uuid;

  // Check that user exists
  db.get("SELECT * FROM users WHERE uuid = ?", [userUuid], (err, userRow) => {
    if (err) {
      console.error("Error selecting user:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        newCategory: null,
      });
      return;
    }

    if (!userRow) {
      res.json({
        error: 1,
        message: "User does not exist",
        newCategory: null,
      });
      return;
    }

    // Check that course exists
    db.get("SELECT * FROM courses WHERE uuid = ?", [courseID], (err, courseRow) => {
      if (err) {
        console.error("Error selecting course:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          newCategory: null,
        });
        return;
      }

      if (!courseRow) {
        res.json({
          error: 2,
          message: "Course does not exist",
          newCategory: null,
        });
        return;
      }

      // Check that semester exists
      db.get("SELECT * FROM semesters WHERE uuid = ?", [courseRow.semester_uuid], (err, semesterRow) => {
        if (err) {
          console.error("Error selecting semester:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
            newCategory: null,
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 3,
            message: "Semester does not exist",
            newCategory: null,
          });
          return;
        }

        // Check that user is authorized to access the specified semester
        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 4,
            message: "User does not have authorized access to the specified semester",
            newCategory: null,
          });
          return;
        }

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
    });
  });
});

const isOwnerMWEdit = ownerCheck.getMW((req) => req.body.modifiedCategory.categoryID, ownerCheck.sql.cat);
router.post("/edit", isOwnerMWEdit, (req, res) => {
  //TODO
  res.sendStatus(501);
});

const isOwnerMWDel = ownerCheck.getMW((req) => req.body.semesterID, ownerCheck.sql.cat);
router.post("/delete", isOwnerMWDel, (req, res) => {
  //TODO
  res.sendStatus(501);
});

module.exports = router;
