// semesters.js
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = (app, db) => {
  // /semesters GET request
  app.get("/semesters", (req, res) => {
    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 2,
        message: "Invalid or missing token",
        semesterList: [],
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
            error: 5,
            message: "Expired token",
            semesterList: [],
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 3,
          message: "Invalid or missing token",
          semesterList: [],
        });
        return;
      }
      res.status(401).json({
        error: 3,
        message: "Invalid or missing token",
        semesterList: [],
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 4,
        message: "Invalid or missing token",
        semesterList: [],
      });
      return;
    }

    const userUuid = decodedToken.uuid;

    // Check that user exists
    db.get("SELECT * FROM users WHERE uuid = ?", [userUuid], async (err, row) => {
      if (err) {
        console.error("Error selecting user:", err);
        res.status(500).json({
          error: -1,
          message: "Internal server error",
          semesterList: [],
        });
        return;
      }

      if (!row) {
        res.json({
          error: 1,
          message: "User does not exist",
          semesterList: [],
        });
        return;
      }

      // Get all semesters
      db.all("SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?", [userUuid], (err, rows) => {
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
  });

  // /add-semester POST request
  app.post("/add-semester", async (req, res) => {
    // Get request body
    const { candidateSemester } = req.body;
    const { semesterName } = candidateSemester;

    // Check if request body contains the required fields
    if (!semesterName) {
      res.status(400).json({
        error: -2,
        message: "Missing required fields",
        newSemester: null,
      });
      return;
    }

    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 3,
        message: "Invalid or missing token",
        newSemester: null,
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
            error: 6,
            message: "Expired token",
            newSemester: null,
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 4,
          message: "Invalid or missing token",
          newSemester: null,
        });
        return;
      }
      res.status(401).json({
        error: 4,
        message: "Invalid or missing token",
        newSemester: null,
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 5,
        message: "Invalid or missing token",
        newSemester: null,
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
          newSemester: null,
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: "User does not exist",
          newSemester: null,
        });
        return;
      }

      // Check that semester does not already exist
      db.get("SELECT * FROM semesters WHERE semester_name = ? AND user_uuid = ?", [semesterName, userUuid], (err, semesterRow) => {
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
        db.run("INSERT INTO semesters (uuid, user_uuid, semester_name) VALUES (?, ?, ?)", [newSemesterID, userUuid, semesterName], (err) => {
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
              newSemester: {...candidateSemester, semesterID: newSemesterID},
            });
          }
        });
      });
    });
  });
};
