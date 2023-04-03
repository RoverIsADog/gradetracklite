// Utilities
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Database
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "../database.db"));
// Routing
const express = require("express");
const router = express.Router();

/**
 * This file contains API requests (apiURL/account/x) that allow doing
 * account-related queries such as modifying info (/edit/info), changing
 * passwords (/edit/password), downloading data (/download), and deleting
 * the account (/delete).
 *
 * Authentication required (JWT middleware ran before arriving here).
 * Assume all requests will have valid tokens (bad ones don't get past MW).
 * Assume req.auth exists and contains token payload.
 */

/**
 * This request is for changing account information, not the password.
 * Similar to apiURL/auth/register, we're provided account information.
 * The server will merge the new information into the database.
 *
 * Unsure if fields that haven't been modified are sent aswell.
 *
 * This request returns a fresh new token because the frontend uses the
 * username contained in the token's payload to display the user's profile
 */
router.post("/edit/info", (req, res) => {
  // TODO returning placeholder for now
  res.json({
    error: 0,
    message: "All good",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTk0M2MyMGQtYTFmMS00MzIyLWIzOGEtYzk2NzRhY2MxNGE2IiwidXNlcm5hbWUiOiJSYW5kb20iLCJlbWFpbCI6bnVsbCwiaWF0IjoxNjgwNDk5MjA1LCJleHAiOjE2ODA1MDI4MDV9.7S1amSiXtFBTEdMP3kqR6bt3TZgAAGzgpWNs2N4ZXAo",
  });
});

/**
 * This request is for changing the account's password.
 */
router.post("/edit/password", (req, res) => {
  // TODO returning placeholder for now
  res.json({
    error: 0,
    message: "All good",
  });
});

/**
 * This request is for downloading all the user's data.
 * The response should trigger the browser to download a JSON file
 * (it can be some other field type aswell).
 */
router.get("/download", (req, res) => {
  // TODO returning placeholder JSON object for now
  const placeholderData = {
    mother: "Is a hamster",
    father: "Smells of elderberries",
    randomList: ["Tis but a scratch", "Are you the Judean People’s Front?"],
  };
  const placeholderDataStr = JSON.stringify(placeholderData);
  res.set({
    "Content-Disposition": 'attachment; filename="export.json"',
  });
  res.send(placeholderDataStr);
});

/**
 * This request is for deleting the user's account and all data
 * associated with it.
 */
router.post("/delete", (req, res) => {
  res.json({
    error: 0,
    message: "Deleted successfully",
  });
});

module.exports = router;
