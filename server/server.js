const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Create the users table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    uuid TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT
  );`, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created');
    }
  }
);

// Create the semesters table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS semesters (
    uuid TEXT PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    semester_name TEXT NOT NULL,
    FOREIGN KEY(user_uuid) REFERENCES users(uuid)
  );`, (err) => {
    if (err) {
      console.error('Error creating semesters table:', err);
    } else {
      console.log('Semesters table created');
    }
  }
);

// Create the courses table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS courses (
    uuid TEXT PRIMARY KEY,
    semester_uuid TEXT NOT NULL,
    course_name TEXT NOT NULL,
    course_credits INTEGER NOT NULL,
    course_description TEXT,
    FOREIGN KEY(semester_uuid) REFERENCES semesters(uuid)
  );`, (err) => {
    if (err) {
      console.error('Error creating courses table:', err);
    } else {
      console.log('Courses table created');
    }
  }
);

// Create the grade_categories table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS grade_categories (
    uuid TEXT PRIMARY KEY,
    course_uuid TEXT NOT NULL,
    category_type TEXT NOT NULL,
    category_weight INTEGER NOT NULL,
    category_description TEXT,
    FOREIGN KEY(course_uuid) REFERENCES courses(uuid)
  );`, (err) => {
    if (err) {
      console.error('Error creating grade_categories table:', err);
    } else {
      console.log('grade_categories table created');
    }
  }
);

// Create the grade_items table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS grade_items (
    uuid TEXT PRIMARY KEY,
    category_uuid TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_weight INTEGER NOT NULL,
    item_mark INTEGER NOT NULL,
    item_total INTEGER NOT NULL,
    item_description TEXT,
    item_date TEXT NOT NULL,
    FOREIGN KEY (category_uuid) REFERENCES grade_categories(uuid)
  );`, (err) => {
    if (err) {
      console.error('Error creating grade_items table:', err);
    } else {
      console.log('grade_items table created');
    }
  }
);

// Routes
require('./routes')(app, db);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
