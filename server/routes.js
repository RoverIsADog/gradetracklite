// routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
//const { expressjwt: expressJwt } = require('express-jwt');

module.exports = (app, db) => {
  // /login POST request
  app.post('/login', async (req, res) => {
    // Get request body
    const { username, password } = req.body;

    // SQL query
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        res.status(500).json({
          error: -1,
          message: 'Internal server error',
          token: null
        });
        return;
      }

      // Check if user exists
      if (row) {
        // Check if password matches
        const match = await bcrypt.compare(password, row.password);
        if (match) {
          // Generate JWT token
          const token = jwt.sign(
            {
              uuid: row.uuid,
              username: row.username,
              email: row.email
            },
            process.env.JWT_SECRET, // || 'my_secret_key_for_the_signed_jwt_token'
            { expiresIn: '1h' }
          );

          // Success response
          res.json({
            error: 0,
            message: 'Successful login',
            token: token
          });
        } else {
          res.json({
            error: 1,
            message: 'Invalid username or password',
            token: null
          }); // Invalid password
        }
      } else {
        res.json({
          error: 2,
          message: 'Invalid username or password',
          token: null
        }); // Invalid username
      }
    });
  });

  // /register POST request
  app.post('/register', async (req, res) => {
    // Get request body
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({
          error: -1,
          message: 'Internal server error'
        });
        return;
      }

      // Check if user exists
      if (row) {
        res.json({
          error: 1,
          message: 'Username already exists'
        });
      } else {
        db.run(
          'INSERT INTO users (uuid, username, password, email) VALUES (?, ?, ?, ?)',
          [uuidv4(), username, hashedPassword, email || null],
          (err) => {
            if (err) {
              console.error('Error inserting user:', err);
              res.status(500).json({
                error: -1,
                message: 'Internal server error'
              });
            } else {
              // Success response
              res.json({
                error: 0,
                message: 'User created successfully'
              });
            }
          }
        );
      }
    });
  });

  // /semesters GET request
  app.get('/semesters', (req, res) => {
    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 2,
        message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    // Decode the JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
    } catch (err) {
      // Check if token is expired
      try {
        const { exp } = jwt.decode(token);
        if (exp * 1000 < Date.now()) {
          res.status(401).json({
            error: 5,
            message: 'Expired token',
            semester_list: []
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 3,
          message: 'Invalid or missing token',
          semester_list: []
        });
        return;
      }
      res.status(401).json({
        error: 3,
        message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 4,
        message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    const userUuid = decodedToken.uuid;

    // Check that user exists
    db.get('SELECT * FROM users WHERE uuid = ?', [userUuid], async (err, row) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({
          error: -1,
          message: 'Internal server error',
          semester_list: []
        });
        return;
      }

      if (!row) {
        res.json({
          error: 1,
          message: 'User does not exist',
          semester_list: []
        });
        return;
      }

      // Get all semesters
      db.all(
        'SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?',
        [userUuid],
        (err, rows) => {
          if (err) {
            console.error('Error fetching semesters:', err);
            res.status(500).json({
              error: -1,
              message: 'Internal server error',
              semester_list: []
            });
            return;
          }

          // Create semester list
          const semesterList = rows.map((row) => ({
            uuid: row.uuid,
            semester_name: row.semester_name,
          }));

          // Success response
          res.json({
            error: 0,
            message: 'Semesters successfully fetched',
            semester_list: semesterList,
          });
        });
    });
  });

  // To remove later
  app.get('/test', (req, res) => {
    db.all('SELECT * FROM semesters', (err, rows) => {
      if (err) {
        console.error('Error fetching all semesters:', err);
        res.status(500).json({ error: -1, error_message: 'Internal server error' });
      }

      const semesterList = rows.map((row) => ({
        uuid: row.uuid,
        semester_name: row.semester_name,
      }));
      res.json(semesterList);
    });
  });

  // To remove later
  app.post('/test', (req, res) => {
    const { user_uuid, semester_name } = req.body;
    db.run(
      'INSERT INTO semesters (uuid, user_uuid, semester_name) VALUES (?, ?, ?)',
      [uuidv4(), user_uuid, semester_name],
      (err) => {
        if (err) {
          console.error('Error inserting semester:', err);
          res.status(500).json({ error: -1, error_message: 'Internal server error' });
        } else {
          res.status(200).json({ error: 0, error_message: 'Semester created successfully' });
        }
      }
    );
  });

  // /courses GET request
  app.get('/courses', (req, res) => {
    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 4,
        message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    // Decode the JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
    } catch (err) {
      // Check if token is expired
      try {
        const { exp } = jwt.decode(token);
        if (exp * 1000 < Date.now()) {
          res.status(401).json({
            error: 7,
            message: 'Expired token',
            semester_list: []
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 5,
          message: 'Invalid or missing token',
          semester_list: []
        });
        return;
      }
      res.status(401).json({
        error: 5,
        message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 6,
        message: 'Invalid or missing token',
        course_list: []
      });
      return;
    }

    const userUuid = decodedToken.uuid;
    const semesterUuid = req.query.semester_id;

    // Check that user exists
    db.get('SELECT * FROM users WHERE uuid = ?', [userUuid], async (err, userRow) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({
          error: -1,
          message: 'Internal server error',
          course_list: []
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: 'User does not exist',
          course_list: []
        });
        return;
      }

      // Check that semester exists
      db.get('SELECT * FROM semesters WHERE uuid = ?', [semesterUuid], (err, semesterRow) => {
        if (err) {
          console.error('Error selecting semester:', err);
          res.status(500).json({
            error: -1,
            message: 'Internal server error',
            course_list: []
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 2,
            message: 'Semester does not exist',
            course_list: []
          });
        }

        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 3,
            message: 'User does not have authorized access to the specified semester',
            course_list: []
          });
        }

        // Get all courses
        db.all(
          'SELECT uuid, course_name, course_credits, course_description FROM courses WHERE semester_uuid = ?',
          [semesterUuid],
          (err, rows) => {
            if (err) {
              console.error('Error fetching courses:', err);
              res.status(500).json({
                error: -1,
                message: 'Internal server error',
                course_list: []
              });
              return;
            }
  
            // Create course list
            const courseList = rows.map((row) => ({
              uuid: row.uuid,
              course_name: row.course_name,
              course_credits: row.course_credits,
              course_description: row.course_description || 'No Description.'
            }));
  
            // Success response
            res.json({
              error: 0,
              message: 'Courses successfully fetched',
              course_list: courseList,
            });
          }
        );
      });
    });
  });

  // /add-semester POST request
  app.post('/add-semester', async (req, res) => {
    // Get request body
    const { semester_name } = req.body;

    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 3,
        message: 'Invalid or missing token'
      });
      return;
    }

    // Decode the JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
    } catch (err) {
      // Check if token is expired
      try {
        const { exp } = jwt.decode(token);
        if (exp * 1000 < Date.now()) {
          res.status(401).json({
            error: 6,
            message: 'Expired token'
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 4,
          message: 'Invalid or missing token'
        });
        return;
      }
      res.status(401).json({
        error: 4,
        message: 'Invalid or missing token'
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 5,
        message: 'Invalid or missing token'
      });
      return;
    }

    const userUuid = decodedToken.uuid;

    // Check that user exists
    db.get('SELECT * FROM users WHERE uuid = ?', [userUuid], async (err, userRow) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({
          error: -1,
          message: 'Internal server error'
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: 'User does not exist'
        });
        return;
      }

      // Check that semester does not already exist
      db.get('SELECT * FROM semesters WHERE semester_name = ? AND user_uuid = ?',
      [semester_name, userUuid],
      (err, semesterRow) => {
        if (err) {
          console.error('Error selecting semester:', err);
          res.status(500).json({
            error: -1,
            message: 'Internal server error'
          });
          return;
        }

        if (semesterRow) {
          res.json({
            error: 2,
            message: 'Semester already exists'
          });
          return;
        }

        // SQL query
        db.run(
          'INSERT INTO semesters (uuid, user_uuid, semester_name) VALUES (?, ?, ?)',
          [uuidv4(), userUuid, semester_name],
          (err) => {
            if (err) {
              console.error('Error inserting semester:', err);
              res.status(500).json({
                error: -1,
                message: 'Internal server error'
              });
              return;
            } else {
              res.status(200).json({
                error: 0,
                message: 'Semester created successfully'
              });
            }
          }
        );
      });
    });
  });

  // /add-course POST request
  app.post('/add-course', async (req, res) => {
    // Get request body
    const { semesterUuid, courseName, courseCredits, courseDescription } = req.body;

    // Get JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 5,
        message: 'Invalid or missing token'
      });
      return;
    }

    // Decode the JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
    } catch (err) {
      // Check if token is expired
      try {
        const { exp } = jwt.decode(token);
        if (exp * 1000 < Date.now()) {
          res.status(401).json({
            error: 8,
            message: 'Expired token'
          });
          return;
        }
      } catch (err) {
        res.status(401).json({
          error: 6,
          message: 'Invalid or missing token'
        });
        return;
      }
      res.status(401).json({
        error: 6,
        message: 'Invalid or missing token'
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 7,
        message: 'Invalid or missing token'
      });
      return;
    }

    const userUuid = decodedToken.uuid;

    // Check that user exists
    db.get('SELECT * FROM users WHERE uuid = ?', [userUuid], async (err, userRow) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({
          error: -1,
          message: 'Internal server error'
        });
        return;
      }

      if (!userRow) {
        res.json({
          error: 1,
          message: 'User does not exist'
        });
        return;
      }

      // Check that semester exists
      db.get('SELECT * FROM semesters WHERE uuid = ?',
      [semesterUuid],
      (err, semesterRow) => {
        if (err) {
          console.error('Error selecting semester:', err);
          res.status(500).json({
            error: -1,
            message: 'Internal server error'
          });
          return;
        }

        if (!semesterRow) {
          res.json({
            error: 2,
            message: 'Semester does not exist'
          });
          return;
        }

        // Check that user is authorized to access the specified semester
        if (semesterRow.user_uuid !== userUuid) {
          res.json({
            error: 3,
            message: 'User does not have authorized access to the specified semester'
          });
        }

        // Check that course does not already exist
        db.get('SELECT * FROM courses WHERE semester_uuid = ? AND course_name = ?',
        [semesterUuid, courseName],
        (err, courseRow) => {
          if (err) {
            console.error('Error selecting course:', err);
            res.status(500).json({
              error: -1,
              message: 'Internal server error'
            });
            return;
          }

          if (courseRow) {
            res.json({
              error: 4,
              message: 'Course already exists'
            });
            return;
          }

          // SQL query
          db.run(
            'INSERT INTO courses (uuid, semester_uuid, course_name, course_credits, course_description) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), semesterUuid, courseName, courseCredits, courseDescription],
            (err) => {
              if (err) {
                console.error('Error inserting course:', err);
                res.status(500).json({
                  error: -1,
                  message: 'Internal server error'
                });
                return;
              } else {
                res.status(200).json({
                  error: 0,
                  message: 'Course created successfully'
                });
              }
            }
          );
        });
      });
    });
  });

  // / request
};
