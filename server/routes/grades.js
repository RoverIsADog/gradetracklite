// Utilities
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../database.db"));
// Routing
const express = require("express");
const router = express.Router();

/**
 * This file contains API requests (apiURL/grades/x) that allow adding
 * (/add) and modifying (/edit) a grade.
 * 
 * There is no /list or /get here because that's handled by /courses/get.
 * 
 * Authentication required (JWT middleware ran before arriving here).
 * Assume all requests will have valid tokens (bad ones don't get past MW).
 * Assume req.auth exists and contains token payload.
 */

// apiURL/grades/add POST request
router.post("/add", (req, res) => {
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

  // Get JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      error: 7,
      message: "Invalid or missing token",
      newGrade: null,
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
          error: 10,
          message: "Expired token",
          newGrade: null,
        });
        return;
      }
    } catch (err) {
      res.status(401).json({
        error: 8,
        message: "Invalid or missing token",
        newGrade: null,
      });
      return;
    }
    res.status(401).json({
      error: 8,
      message: "Invalid or missing token",
      newGrade: null,
    });
    return;
  }

  // Get the user's UUID from the JWT token
  if (!decodedToken || !decodedToken.uuid) {
    res.status(401).json({
      error: 9,
      message: "Invalid or missing token",
      newGrade: null,
    });
    return;
  }

  const userUuid = decodedToken.uuid;

  // Check that user exists
  db.get("SELECT * FROM users WHERE uuid = ?", [userUuid], async (err, userRow) => {
    if (err) {
      console.error("Error selecting user:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        newGrade: null,
      });
      return;
    }

    if (!userRow) {
      res.json({
        error: 1,
        message: "User does not exist",
        newGrade: null,
      });
      return;
    }

    // Check that grade category exists
    db.get("SELECT * FROM grade_categories WHERE uuid = ?", [categoryID], (err, categoryRow) => {
      if (err) {
        console.error("Error selecting grade category:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          newGrade: null,
        });
        return;
      }

      if (!categoryRow) {
        res.json({
          error: 2,
          message: "Grade category does not exist",
          newGrade: null,
        });
        return;
      }

      // Check that course exists
      db.get("SELECT * FROM courses WHERE uuid = ?", [categoryRow.course_uuid], (err, courseRow) => {
        if (err) {
          console.error("Error selecting course:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
            newGrade: null,
          });
          return;
        }

        if (!courseRow) {
          res.json({
            error: 3,
            message: "Course does not exist",
            newGrade: null,
          });
          return;
        }

        // Check that semester exists
        db.get("SELECT * FROM semesters WHERE uuid =?", [courseRow.semester_uuid], (err, semesterRow) => {
          if (err) {
            console.error("Error selecting semester:", err);
            res.status(500).json({
              error: -1,
              message: "Internal server error",
              newGrade: null,
            });
            return;
          }

          if (!semesterRow) {
            res.json({
              error: 4,
              message: "Semester does not exist",
              newGrade: null,
            });
            return;
          }

          // Check that user is authorized to access the specified semester
          if (semesterRow.user_uuid !== userUuid) {
            res.json({
              error: 5,
              message: "User does not have authorized access to the specified semester",
              newGrade: null,
            });
            return;
          }

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
      });
    });
  });
});

router.post("/edit", (req, res) => {
  //TODO
  res.sendStatus(501);
});

router.post("/delete", (req, res) => {
//TODO
  res.sendStatus(501);
})

module.exports = router;
