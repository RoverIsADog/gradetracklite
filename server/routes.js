// routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
console.log('expressJwt:', expressJwt);

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
  app.use(
    '/semester-list',
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] })
  );

  // /semester-list GET request
  app.get('/semester-list', (req, res) => {
    // Get user UUID
    const userUuid = req.user.uuid;

    // SQL query
    db.all(
      'SELECT uuid, course_name, course_credits, course_description FROM semesters WHERE user_uuid = ?',
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
          course_name: row.course_name,
          course_credits: row.course_credits,
          course_description: row.course_description || 'None',
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

  // / request
};
