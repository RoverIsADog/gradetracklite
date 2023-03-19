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
        course_list: [],
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
            course_list: [],
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 5,
          message: "Invalid or missing token",
          course_list: [],
        });
        return;
      }
      res.status(401).json({
        error: 5,
        message: "Invalid or missing token",
        course_list: [],
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 6,
        message: "Invalid or missing token",
        course_list: [],
      });
      return;
    }

    const userUuid = decodedToken.uuid;
    const semesterUuid = req.query.semester_id;

    // Check if query contains the required parameters
    if (!semesterUuid) {
      res.status(400).json({
        error: -2,
        message: "Missing required query parameters",
        course_list: [],
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
          course_list: [],
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
          course_list: [],
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
            course_list: [],
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 2,
            message: "Semester does not exist",
            course_list: [],
          });
          return;
        }

        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 3,
            message: "User does not have authorized access to the specified semester",
            course_list: [],
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
              course_list: [],
            });
            return;
          }

          // Create course list
          const courseList = rows.map((row) => ({
            uuid: row.uuid,
            course_name: row.course_name,
            course_credits: row.course_credits,
            course_description: row.course_description || "No Description.",
          }));

          // Success response
          res.json({
            error: 0,
            message: "Courses successfully fetched",
            course_list: courseList,
          });
        });
      });
    });
  });

  // /add-course POST request
  app.post("/add-course", async (req, res) => {
    // Get request body
    const { semesterUuid, courseName, courseCredits, courseDescription } = req.body;

    // Check if request body contains the required fields
    if (!semesterUuid || !courseName || !courseCredits) {
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
        });
        return;
      }
      res.status(401).json({
        error: 6,
        message: "Invalid or missing token",
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 7,
        message: "Invalid or missing token",
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
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
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
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 2,
            message: "Semester does not exist",
          });
          return;
        }

        // Check that user is authorized to access the specified semester
        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 3,
            message: "User does not have authorized access to the specified semester",
          });
          return;
        }

        // Check that course does not already exist
        db.get("SELECT * FROM courses WHERE semester_uuid = ? AND course_name = ?", [semesterUuid, courseName], (err, courseRow) => {
          if (err) {
            console.error("Error selecting course:", err);
            res.status(500).json({
              error: -1,
              message: "Internal server error",
            });
            return;
          }

          if (courseRow) {
            res.json({
              error: 4,
              message: "Course already exists",
            });
            return;
          }

          // SQL query
          db.run("INSERT INTO courses (uuid, semester_uuid, course_name, course_credits, course_description) VALUES (?, ?, ?, ?, ?)", [uuidv4(), semesterUuid, courseName, courseCredits, courseDescription || "No Description."], (err) => {
            if (err) {
              console.error("Error inserting course:", err);
              res.status(500).json({
                error: -1,
                message: "Internal server error",
              });
              return;
            } else {
              res.status(200).json({
                error: 0,
                message: "Course created successfully",
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
        category_list: [],
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
            category_list: [],
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 6,
          message: "Invalid or missing token",
          category_list: [],
        });
        return;
      }
      res.status(401).json({
        error: 6,
        message: "Invalid or missing token",
        category_list: [],
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 7,
        message: "Invalid or missing token",
        category_list: [],
      });
      return;
    }

    const userUuid = decodedToken.uuid;
    const courseUuid = req.query.course_id;

    // Check if query contains the required parameters
    if (!courseUuid) {
      res.status(400).json({
        error: -2,
        message: "Missing required query parameters",
        category_list: [],
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
          category_list: [],
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
          category_list: [],
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
            category_list: [],
          });
          return;
        }

        if (!courseRow) {
          res.json({
            error: 2,
            message: "Course does not exist",
            category_list: [],
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
              category_list: [],
            });
            return;
          }

          if (!semesterRow) {
            res.json({
              error: 3,
              message: "Semester does not exist",
              category_list: [],
            });
            return;
          }

          // Check that user is authorized to access the specified semester
          if (semesterRow.user_uuid !== userUuid) {
            res.json({
              error: 4,
              message: "User does not have authorized access to the specified semester",
              category_list: [],
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
                category_list: [],
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
                      uuid: item.uuid,
                      item_name: item.item_name,
                      item_weight: item.item_weight,
                      item_mark: item.item_mark,
                      item_total: item.item_total,
                      item_description: item.item_description || "No Description.",
                      item_date: item.item_date,
                    }));

                    resolve({
                      uuid: category.uuid,
                      category_type: category.category_type,
                      category_weight: category.category_weight,
                      category_description: category.category_description || "No Description.",
                      category_grade_list: categoryGradeList,
                    });
                  });
                })
            );

            Promise.all(categoryPromises)
              .then((categoryList) => {
                res.json({
                  error: 0,
                  message: "Course information successfully fetched",
                  category_list: categoryList,
                });
              })
              .catch((err) => {
                console.error("Error fetching grade_items:", err);
                res.status(500).json({
                  error: -1,
                  message: "Internal server error",
                  category_list: [],
                });
              });
          });
        });
      });
    });
  });
};
