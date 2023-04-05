// Utilities
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../database.db"));
db.get("PRAGMA foreign_keys = ON");
// Routing
const express = require("express");
const router = express.Router();

/**
 * This file contains API requests (apiURL/auth/x) to perform actions
 * relating to authentication such as logging in (/login) and
 * registering (/register)
 *
 * No authentication required (JWT middleware did NOT run before arriving
 * here).
 */

// apiURL/auth/login POST request
router.post("/login", async (req, res) => {
  // Get request body
  const { username, password } = req.body;

  // Check if request body contains the required fields
  if (!username || !password) {
    res.status(400).json({
      error: -2,
      message: "Missing required fields",
      token: null,
    });
    return;
  }

  // SQL query
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
    if (err) {
      res.status(500).json({
        error: -1,
        message: "Internal server error",
        token: null,
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
            email: row.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Success response
        res.json({
          error: 0,
          message: "Successful login",
          token: token,
        });
      } else {
        res.json({
          error: 1,
          message: "Invalid username or password",
          token: null,
        }); // Invalid password
      }
    } else {
      res.json({
        error: 2,
        message: "Invalid username or password",
        token: null,
      }); // Invalid username
    }
  });
});

// apiURL/auth/register POST request
router.post("/register", async (req, res) => {
  // Get request body
  const { username, password, email } = req.body;

  // Check if request body contains the required fields
  if (!username || !password) {
    res.status(400).json({
      error: -2,
      message: "Missing required fields",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // SQL query
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error("Error selecting user:", err);
      res.status(500).json({
        error: -1,
        message: "Internal server error",
      });
      return;
    }

    // Check if user exists
    if (row) {
      res.json({
        error: 1,
        message: "Username already exists",
      });
    } else {
      db.run("INSERT INTO users (uuid, username, password, email) VALUES (?, ?, ?, ?)", [uuidv4(), username, hashedPassword, email || null], (err) => {
        if (err) {
          console.error("Error inserting user:", err);
          res.status(500).json({
            error: -1,
            message: "Internal server error",
          });
        } else {
          // Success response
          res.json({
            error: 0,
            message: "User created successfully",
          });
        }
      });
    }
  });
});

module.exports = router;
