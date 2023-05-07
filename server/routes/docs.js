// Utilities
const fs = require("fs");
// Routing
const express = require("express");
const router = express.Router();

/**
 * This file contains API requests (apiURL/static/x) to get strings
 * representing user-editable static content (that can't make into the
 * React build) such as a custom privacy policy and terms of use.
 * 
 * The expectation is that the client takes care of rendering it.
 * 
 * No authentication required (JWT middleware did NOT run before arriving
 * here).
 */

// Load files into string form at server start.
const privacy = fs.readFileSync("../data/docs/privacy.md").toString();
const terms = fs.readFileSync("../data/docs/terms.md").toString();

router.get("/privacy", (req, res) => {
  res.json({
    type: "markdown", // Currently, no other formats
    content: privacy
  });
});

router.get("/terms", (req, res) => {
  res.json({
    type: "markdown", // Currently, no other formats
    content: terms
  });
}); 

module.exports = router;