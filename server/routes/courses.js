// courses.js
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = (app, db) => {
  // /courses GET request
  app.get("/courses", (req, res) => {
    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 4,
        message: "Invalid or missing token",
        courseList: [],
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
            error: 7,
            message: "Expired token",
            courseList: [],
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 5,
          message: "Invalid or missing token",
          courseList: [],
        });
        return;
      }
      res.status(401).json({
        error: 5,
        message: "Invalid or missing token",
        courseList: [],
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 6,
        message: "Invalid or missing token",
        courseList: [],
      });
      return;
    }

    const userUuid = decodedToken.uuid;
    const semesterUuid = req.query.semesterID;

    // Check if query contains the required parameters
    if (!semesterUuid) {
      res.status(400).json({
        error: -2,
        message: "Missing required query parameters",
        courseList: [],
      });
      return;
    }

    // Check that user exists
    db.get("SELECT * FROM users WHERE uuid = ?", [userUuid], async (err, userRow) => {
      if (err) {
        console.error("Error selecting user:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          courseList: [],
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
          courseList: [],
        });
        return;
      }

      // Check that semester exists
      db.get("SELECT * FROM semesters WHERE uuid = ?", [semesterUuid], (err, semesterRow) => {
        if (err) {
          console.error("Error selecting semester:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
            courseList: [],
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 2,
            message: "Semester does not exist",
            courseList: [],
          });
          return;
        }

        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 3,
            message: "User does not have authorized access to the specified semester",
            courseList: [],
          });
          return;
        }

        // Get all courses
        db.all("SELECT uuid, course_name, course_credits, course_description FROM courses WHERE semester_uuid = ?", [semesterUuid], (err, rows) => {
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
    });
  });

  // /add-course POST request
  app.post("/add-course", async (req, res) => {
    // Get request body
    const { semesterID, candidateCourse } = req.body;
    const { courseName, courseCredits, courseDescription } = candidateCourse;

    // Check if request body contains the required fields
    if (!semesterID || !courseName || !courseCredits) {
      res.status(400).json({
        error: -2,
        message: "Missing required fields",
      });
      return;
    }

    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 5,
        message: "Invalid or missing token",
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
            error: 8,
            message: "Expired token",
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 6,
          message: "Invalid or missing token",
          newCourse: null,
        });
        return;
      }
      res.status(401).json({
        error: 6,
        message: "Invalid or missing token",
        newCourse: null,
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 7,
        message: "Invalid or missing token",
        newCourse: null,
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
          newCourse: null,
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
          newCourse: null,
        });
        return;
      }

      // Check that semester exists
      db.get("SELECT * FROM semesters WHERE uuid = ?", [semesterID], (err, semesterRow) => {
        if (err) {
          console.error("Error selecting semester:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
            newCourse: null,
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 2,
            message: "Semester does not exist",
            newCourse: null,
          });
          return;
        }

        // Check that user is authorized to access the specified semester
        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 3,
            message: "User does not have authorized access to the specified semester",
            newCourse: null,
          });
          return;
        }

        // Check that course does not already exist
        db.get("SELECT * FROM courses WHERE semester_uuid = ? AND course_name = ?", [semesterID, courseName], (err, courseRow) => {
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
          db.run("INSERT INTO courses (uuid, semester_uuid, course_name, course_credits, course_description) VALUES (?, ?, ?, ?, ?)", [newCourseID, semesterID, courseName, courseCredits, courseDescription || "No Description."], (err) => {
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
                newCourse: {...candidateCourse, courseID: newCourseID},
              });
            }
          });
        });
      });
    });
  });

  // /course GET request
  app.get("/course", (req, res) => {
    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 5,
        message: "Invalid or missing token",
        categoryList: [],
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
            error: 8,
            message: "Expired token",
            categoryList: [],
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 6,
          message: "Invalid or missing token",
          categoryList: [],
        });
        return;
      }
      res.status(401).json({
        error: 6,
        message: "Invalid or missing token",
        categoryList: [],
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 7,
        message: "Invalid or missing token",
        categoryList: [],
      });
      return;
    }

    const userUuid = decodedToken.uuid;
    const courseUuid = req.query.courseID;

    // Check if query contains the required parameters
    if (!courseUuid) {
      res.status(400).json({
        error: -2,
        message: "Missing required query parameters",
        categoryList: [],
      });
      return;
    }

    // Check that user exists
    db.get("SELECT * FROM users WHERE uuid = ?", [userUuid], async (err, userRow) => {
      if (err) {
        console.error("Error selecting user:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          categoryList: [],
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
          categoryList: [],
        });
        return;
      }

      // Check that course exists
      db.get("SELECT * FROM courses WHERE uuid = ?", [courseUuid], (err, courseRow) => {
        if (err) {
          console.error("Error selecting course:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
            categoryList: [],
          });
          return;
        }

        if (!courseRow) {
          res.json({
            error: 2,
            message: "Course does not exist",
            categoryList: [],
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
              categoryList: [],
            });
            return;
          }

          if (!semesterRow) {
            res.json({
              error: 3,
              message: "Semester does not exist",
              categoryList: [],
            });
            return;
          }

          // Check that user is authorized to access the specified semester
          if (semesterRow.user_uuid !== userUuid) {
            res.json({
              error: 4,
              message: "User does not have authorized access to the specified semester",
              categoryList: [],
            });
            return;
          }

          // Get all grade categories
          db.all("SELECT * FROM grade_categories WHERE course_uuid = ?", [courseUuid], (err, categories) => {
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
      });
    });
  });
};
