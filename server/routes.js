// routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
//const { expressJwt } = require('express-jwt');
//const expressJwt = require('express-jwt');
//console.log('expressJwt:', expressJwt);

module.exports = (app, db) => {
  // /login POST request
  app.post('/login', async (req, res) => {
    // Get request body
    const { username, password } = req.body;

    // SQL query
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        res.status(500).json({ error: -1, error_message: 'Internal server error' });
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
            token: token,
            error: 0,
            error_message: 'Successful login'
          });
        } else {
          res.json({
            error: 1,
            error_message: 'Invalid username or password'
          }); // Invalid password
        }
      } else {
        res.json({
          error: 2,
          error_message: 'Invalid username or password'
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
        res.status(500).json({ error: -1, error_message: 'Internal server error' });
        return;
      }

      // Check if user exists
      if (row) {
        res.json({ error: 1, error_message: 'Username already exists' });
      } else {
        db.run(
          'INSERT INTO users (uuid, username, password, email) VALUES (?, ?, ?, ?)',
          [uuidv4(), username, hashedPassword, email || null],
          (err) => {
            if (err) {
              console.error('Error inserting user:', err);
              res.status(500).json({ error: -1, error_message: 'Internal server error' });
            } else {
              // Success response
              res.json({ error: 0, message: 'User created successfully' });
            }
          }
        );
      }
    });
  });

  // Middleware to protect the /semester-list route
  const jwtMiddleware = expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] });
  
  app.use(['/semester-list', '/course-list'], (req, res, next) => {
    jwtMiddleware(req, res, (err) => {
      console.log('Inside middleware');
      console.log('req.user:', req.user);
      console.log('err:', err);
      next(err);
    });
  });

  app.use((err, req, res, next) => {
    console.log('Inside error handler');
    console.log('req.user:', req.user);
    console.log('err:', err);
    if (err && err.name === 'UnauthorizedError') {
      res.status(401).json({ error: 3, error_message: 'Invalid or missing token' });
    } else {
      next(err);
    }
  });

  app.use(['/semester-list', '/course-list'], (req, res, next) => {
    jwtMiddleware(req, res, (err) => {
      console.log('Inside middleware');
      console.log('req.user:', req.user);
      console.log('err:', err);
      next(err);
    });
  });

  // /semester-list GET request
  app.get('/semester-list', (req, res) => {
    // Get user UUID
    if (!req.user) {
      res.status(401).json({ error: 3, error_message: 'Invalid or missing token' });
      return;
    }

    const userUuid = req.user.uuid;

    // Check that user exists
    db.get('SELECT * FROM users WHERE uuid = ?', [userUuid], (err, row) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({ error: -1, error_message: 'Internal server error' });
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
    });

    // SQL query
    db.all(
      'SELECT uuid, semester_name FROM semesters WHERE user_uuid = ?',
      [userUuid],
      (err, rows) => {
        if (err) {
          console.error('Error fetching semesters:', err);
          res.status(500).json({ error: -1, error_message: 'Internal server error' });
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
      }
    );
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
