// Utilities
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../../data/database.db"));
db.get("PRAGMA foreign_keys = ON");
// Routing
const express = require("express");
const ownerCheck = require("../middlewares/ownerCheck");
// Verification
const router = express.Router();

/**
 * This file contains API requests (apiURL/courses/x) that allow adding
 * (/add), modifying (/edit) or retrieving a list (/list) of courses.
 *
 * Unique to courses, we can get a "tree" of categories and grades starting
 * at the specified course (/GET).
 *
 * For all routes here:
 * 
 * Authentication required (JWT middleware ran before arriving here).
 * - Assume all requests will have valid tokens (bad ones don't get past MW).
 * - Assume req.auth exists and contains valid token payload
 * - Assume the user exists.
 */

// apiURL/courses/list GET request
const isOwnerMWList = ownerCheck.getMW((req) => req.query.semesterID, ownerCheck.sql.sem);
router.get("/list", isOwnerMWList, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  isOwnerMWList
   - Parent semester exists, is owned by user
  */

  // Safe because req.query = {} if none
  const semesterID = req.query.semesterID;

  // Check if query contains the required parameters
  if (!semesterID) {
    res.status(400).json({
      error: -2,
      message: "Missing required query parameters",
      courseList: [],
    });
    return;
  }

  // Get all courses
  db.all("SELECT uuid, course_name, course_credits, course_description FROM courses WHERE semester_uuid = ?", [semesterID], (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        courseList: [],
      });
      return;
    }

    // Create course list
    const courseList = rows.map((row) => ({
      courseID: row.uuid,
      courseName: row.course_name,
      courseCredits: row.course_credits,
      courseDescription: row.course_description || "No Description.",
    }));

    // Success response
    res.json({
      error: 0,
      message: "Courses successfully fetched",
      courseList: courseList,
    });
  });
});

// apiURL/courses/add POST request
const isOwnerMWAdd = ownerCheck.getMW((req) => req.body.semesterID, ownerCheck.sql.sem);
router.post("/add", isOwnerMWAdd, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWAdd
  - Parent semester exists, is owned by user
  */

  // Get request body
  const { semesterID, candidateCourse } = req.body;

  // Check if request body contains the required fields
  if (!semesterID || !candidateCourse) {
    res.status(400).json({
      error: -2,
      message: "Missing required fields",
    });
    return;
  }

  const { courseName, courseCredits, courseDescription } = candidateCourse;

  // Check if request body contains the required fields
  if (!courseName || !courseCredits) {
    res.status(400).json({
      error: -2,
      message: "Missing required fields",
    });
    return;
  }

  // Check that course does not already exist
  db.get("SELECT * FROM courses WHERE semester_uuid = ? AND course_name = ?",
  [semesterID, courseName], (err, courseRow) => {
    if (err) {
      console.error("Error selecting course:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        newCourse: null,
      });
      return;
    }

    if (courseRow) {
      res.json({
        error: 4,
        message: "Course already exists",
        newCourse: null,
      });
      return;
    }

    // SQL query
    const newCourseID = uuidv4();
    db.run("INSERT INTO courses (uuid, semester_uuid, course_name, course_credits, course_description) VALUES (?, ?, ?, ?, ?)",
    [newCourseID, semesterID, courseName, courseCredits, courseDescription || "No Description."], (err) => {
      if (err) {
        console.error("Error inserting course:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          newCourse: null,
        });
        return;
      } else {
        res.status(200).json({
          error: 0,
          message: "Course created successfully",
          newCourse: { ...candidateCourse, courseID: newCourseID },
        });
      }
    });
  });
});

// apiURL/courses/get GET request
const isOwnerMWGet = ownerCheck.getMW((req) => req.query.courseID, ownerCheck.sql.course);
router.get("/get", isOwnerMWGet, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
   - Token valid, tok payload in req.auth, user exists
  isOwnerMWGet
   - Course exists, is owned by user
  */

  const courseID = req.query.courseID; // {} if empty

  // Check if query contains the required parameters
  if (!courseID) {
    res.status(400).json({
      error: -2,
      message: "Missing required query parameters",
      categoryList: [],
    });
    return;
  }

  // Get all grade categories
  db.all("SELECT * FROM grade_categories WHERE course_uuid = ?", [courseID], (err, categories) => {
    if (err) {
      console.error("Error fetching grade categories:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        categoryList: [],
      });
      return;
    }

    // Get all grade items corresponding to the specified category
    const categoryPromises = categories.map(
      (category) =>
        new Promise((resolve, reject) => {
          db.all("SELECT * FROM grade_items WHERE category_uuid = ?", [category.uuid], (err, gradeItems) => {
            if (err) {
              reject(err);
              return;
            }

            const categoryGradeList = gradeItems.map((item) => ({
              gradeID: item.uuid,
              gradeName: item.item_name,
              gradeWeight: item.item_weight,
              gradePointsAct: item.item_mark,
              gradePointsMax: item.item_total,
              gradeDescription: item.item_description || "No Description.",
              gradeDate: item.item_date,
            }));

            resolve({
              categoryID: category.uuid,
              categoryName: category.category_type,
              categoryWeight: category.category_weight,
              categoryDescription: category.category_description || "No Description.",
              categoryGradeList: categoryGradeList,
            });
          });
        })
    );

    Promise.all(categoryPromises)
      .then((categoryList) => {
        res.json({
          error: 0,
          message: "Course information successfully fetched",
          categoryList: categoryList,
        });
      })
      .catch((err) => {
        console.error("Error fetching grade_items:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          categoryList: [],
        });
      });
  });
});

const isOwnerMWEdit = ownerCheck.getMW((req) => req.body.modifiedCourse.courseID, ownerCheck.sql.course);
router.post("/edit", isOwnerMWEdit, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWEdit
  - Course exists, is owned by user
  */

  // Get the course to modify
  const { modifiedCourse } = req.body;
  if (!modifiedCourse) {
    res.sendStatus(400).json({
      error: -2,
      message: "Error: missing required field",
    });
    return;
  }

  // Get the course information
  const { courseID, courseName, courseCredits, courseDescription } = modifiedCourse;
  if (!courseID || !courseName || !courseCredits || (!courseDescription && courseDescription !== '')) {
    res.sendStatus(400).json({
      error: -2,
      message: "Error: missing required field",
    });
    return;
  }

  // Modify course
  db.run(
    `UPDATE courses SET course_name = ?, course_credits = ?, course_description = ? WHERE uuid = ?`,
    [courseName, courseCredits, courseDescription, courseID], (err) => {
      if (err) {
        console.error("Error updating course:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
        });
      } else {
        res.json({
          error: 0,
          message: "Course updated successfully",
        });
      }
    }
  );
});

const isOwnerMWDel = ownerCheck.getMW((req) => req.body.courseID, ownerCheck.sql.course);
router.post("/delete", isOwnerMWDel, (req, res) => {
  /* === At this point these middlewares ran providing these guarantees ===
  authMiddlewares (JWT, JWTErrorHandling, JWTPayload, userCheck)
  - Token valid, tok payload in req.auth, user exists
  isOwnerMWDel
  - Course exists, is owned by user
  */
  const { courseID } = req.body;
  if (!courseID) {
    res.status(400).json({
      error: -2,
      message: "Error: missing required field",
    });
  }


  // Delete the course
  db.run("DELETE FROM courses WHERE uuid = ?", [courseID], (err) => {
    if (err) {
      console.log("Error deleting course:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
      return;
    } else {
      res.status(200).json({
        error: 0,
        message: "Course deleted successfully",
      });
    }
  });
});

module.exports = router;
