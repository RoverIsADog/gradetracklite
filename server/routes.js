// routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

module.exports = (app, db) => {
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('/login post request');
    console.log(req.body);
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (row) {
        const match = await bcrypt.compare(password, row.password);
        if (match) {
          res.json({ uuid: row.uuid, username: row.username, email: row.email });
        } else {
          res.json({ error: 0, error_message: 'Invalid username or password' });
        }
      } else {
        res.json({ error: 0, error_message: 'Invalid username or password' });
      }
    });
  });

  app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('/register post request');
    console.log('Request body: ', req.body);

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error('Error selecting user:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (row) {
        res.json({ error: 1, error_message: 'Username already exists' });
      } else {
        db.run(
          'INSERT INTO users (uuid, username, password, email) VALUES (?, ?, ?, ?)',
          [uuidv4(), username, hashedPassword, email || null],
          (err) => {
            if (err) {
              console.error('Error inserting user:', err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.json({ error: 0, message: 'User created successfully' });
            }
          }
        );
      }
    });
  });
};
