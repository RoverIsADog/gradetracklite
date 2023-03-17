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
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
    } catch (err) {
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
    db.get('SELECT * FROM users WHERE uuid =?', [userUuid], async (err, row) => {
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
        error: 2,
        error_message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    // Decode the JWT token
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.decode(token);
    } catch (err) {
      res.status(401).json({
        error: 3,
        error_message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    // Get the user's UUID from the JWT token
    if (!decodedToken || !decodedToken.uuid) {
      res.status(401).json({
        error: 4,
        error_message: 'Invalid or missing token',
        semester_list: []
      });
      return;
    }

    const userUuid = decodedToken.uuid;

    // Check that user exists
    db.get('SELECT * FROM users WHERE uuid =?', [userUuid], async (err, row) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({
          error: -1,
          error_message: 'Internal server error',
          semester_list: []
        });
        return;
      }

      if (!row) {
        res.json({
          error: 1,
          error_message: 'User does not exist',
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
              error_message: 'Internal server error',
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
            error_message: 'Semesters successfully fetched',
            semester_list: semesterList,
          });
        });
    });
  });

  // /course-list GET request
  app.get('/course-list', (req, res) => {
    // Get user UUID
    if (!req.user) {
      res.status(401).json({ error: 3, error_message: 'Invalid or missing token' });
      return;
    }

    const userUuid = req.user.uuid;

    // Get semester UUID
    const semesterUuid = req.query.semester_uuid;

    // Check that semester exists
    db.get('SELECT user_uuid FROM semesters WHERE uuid = ?', [semesterUuid], (err, row) => {
      if (err) {
        console.error('Error selecting semester:', err);
        res.status(500).json({ error: -1, error_message: 'Internal server error' });
        return;
      }

      if (!row) {
        res.json({
          error: 1,
          error_message: 'Semester does not exist',
          course_list: []
        });
        return;
      } else if (row.user_uuid !== userUuid) {
        res.json({
          error: 2,
          error_message: 'User does not have access to this semester',
          course_list: []
        });
        return;
      }

      // SQL query
      db.all(
        'SELECT uuid, course_name, course_credits, course_description FROM courses WHERE semester_uuid = ?',
        [semesterUuid],
        (err, rows) => {
          if (err) {
            console.error('Error fetching courses:', err);
            res.status(500).json({ error: -1, error_message: 'Internal server error' });
            return;
          }

          // Create semester list
          const courseList = rows.map((row) => ({
            uuid: row.uuid,
            course_name: row.course_name,
            course_credits: row.course_credits,
            course_description: row.course_description || 'None',
          }));

          // Success response
          res.json({
            error: 0,
            error_message: 'Courses successfully fetched',
            course_list: courseList,
          });
        }
      );
    });
  });

  // / request
};
