# HTML Folder

This folder contains raw HTML and CSS templates for the frontend webpages with sample data. They are direct implementations of the powerpoint designs. The expectation is that they be re-implemented in React later. 

**THIS FOLDER EXISTS FOR ARCHIVAL PURPOSES ONLY NOW, REACT REIMPLEMENTATION DONE**

## Design Language

### Login Screen

The login screen should get EXPLICIT user consent to the privacy policy and the cookie policy. Users should not be able to login or register for an account without first having read and agreed to the terms.

### Dashboard

#### Grades Management

The dashboard should only be accessible once the user has a valid JSX token. It is composed of 3 "panels": the sidebar, the course panel, the preview panel.

* The sidebar should let the user choose a combination of semester and course and display other options.
* The course panel should display a list of every grades in every grade categories for the selected course.
* The preview panel should display in detail and allow modifying the currently selected item: a grade, category, course or semester.

#### Settings

Upon clicking on the username in the sidebar, a number of options should be available to the user relating to privacy.

* Account info: Let the user change account information. Emails are optional for added security in the event of a breach.
* Revoking cookie consent: The page deletes all used cookies and immediately logs out the user. They will not be able to login again until they accept the cookie policy again. The only way to delete user data from there is to email the developpers.
* Download data: Return a JSON response containing all information held on a specific account (make download if there's time).
* Delete account: Deletes the user's account and all associated data.
