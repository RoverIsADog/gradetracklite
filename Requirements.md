# Requirements

## System Purpose and Scope

GradeTrackLite is a privacy-minded, user-friendly academic grade tracking web application. It is designed to allow students to have a straightforward way to track their grades, compute future grade requirements, and keep track of important academic dates. GradeTrackLite is accessible via web login using user credentials and does not store any user PII on its own databases (aside from the required username and password), allowing users to retain full control over their data storage. GradeTrackLite is **not** intended to replace grade distribution and viewing systems like MyCourses, but rather to be used in coordination with these services, to provide students with additional tools to aid academic success. By minimizing data collection, empowering users to control their data storage and implementing data security measures, GradeTrackLite provides users with a greater sense of privacy and security.

## Sample Systems

There are many synchronised grade tracking apps (grades accessible from anywhere). We searched “Grade Tracking App” on Google and picked 3 from the first page, which is what most users would likely find as well. We picked **Gradebook**, **Grade Tracker Pro**, and **Grades – Grade Calculator, GPA**.

### Gradebook

Gradebook is a system that provides similar functionality to our application – it allows users to input classes, grades, and other information, perform calculations, and make predictions about future grades.

Like GradeTrackLite, Gradebook is also created by students, which might explain the fact that it provides reasonable data privacy and security measures. However, the application still collects some personally identifiable information (PII), including the user’s first and last name, Google identifier, email address and school [^gbpp]. On the other hand, GradeTrackLite strictly collects the user’s username and password (to be exact, a salted and hashed version of the password, rather than the password itself). Although Gradebook claims that this data is used for “basic functionality”, it does not seem necessary for the application’s operation to require the user’s name and school. While Gradebook’s developers claim not to sell user data, they do admit to “work[ing] directly with local advertisers to ensure relevant advertising for [their users]” [^gbpp], likely using the user’s school as location data.

Gradebook allows schools to view anonymized data related to them and request to view an individual’s data (with user approval). Gradebook also claims that users can delete their data at any time, and that it will be permanently deleted (data cannot be recovered). However, Gradebook stores all user data on its servers, which could be compromised in the event of a data breach. Furthermore, it is currently unknown whether Gradebook encrypts its user data. On the other hand, GradeTrackLite allows its users to have their own personal database, stored locally on their personal machine. Additionally, we plan to encrypt user data to add an extra layer of security.

Overall, Gradebook seems to be fairly well privacy minded, and provides a good service to its users, for free, making it a reasonable alternative for users who do not mind handing over their name, Google identifier, email and school data and having this information stored on servers.

### Grade Tracker Pro

Grade Tracker Pro is another system that provides similar functionality to our application, which is available on the Google Play Store for free.

At first hand, it seems like Grade Tracker Pro respects its users’ privacy. It claims not to collect any data about the user [^nspp] (we do not recommend going there). Furthermore, the privacy policy states that information stored locally will not be collected but does not state what exactly is being stored locally and what isn’t. On the other hand, Grade Tracker Pro stores all its user data locally, and uses the android backup feature to ensure synchronisation across devices instead of the developper's own servers.

However, it is important to note that it uses Pollfish SDK to connect users with online surveys for revenue purposes. Pollfish SDK’s privacy policy contains a plethora of privacy concerns. Foremost, Pollfish SDK **automatically** collects all, but not limited to the following (automatically received) data [^pfpp]:

- Device Description
- Network Provider
- Operating system and its version
- Type of connection (e.g., Wi-Fi)
- Device language
- If roaming is used
- If accessibility is enabled
- If the Device is hardware accelerated
- Exact time of communication with server
- User's IP address (retrieved when connecting to the server)
- Device brand info

Pollfish also collects the following data (sociodemographic and content data) [^pfpp]:

- Gender
- Age
- Education
- Income level
- Race
- Spoken languages
- Organization role
- Organization size
- Year of birth
- Marital status
- Employment
- Career
- Zip code

It is important to note that upon starting the surveys or downloading the application, users consent to the privacy policy, meaning that they consent to providing all this information (which clearly includes sensitive PII), but also to the selling of such data to advertisers. While Pollfish claims to be “opt-in” [^pfpp], for a user to stop them from collecting and selling their data, the user must manually access a link on the website, and then submit their advertising ID (which we have no idea how to retrieve). On top of this, the privacy policy is buried 2 links deep under a hidden section in “Developer Contact”. It is also never required to view the privacy policy on download either. As a result, users may be unaware of the data collection practices of this third-party entity.

As explained before, Grade Tracker Pro has a decent privacy policy if we exclude Pollfish. Unfortunately, using Pollfish opens a pandora’s box to some of the worst offenses of software privacy that we have ever seen. For this reason, we strongly recommend avoiding this app if you have any concern for the privacy of your data.

### Grades – Grade Calculator, GPA

Our final comparison is to “Grades – Grade Calculator, GPA”, which is available for free on the Apple App store. The app follows uses a freemium model, offering basic services for free and allowing users to purchase a premium subscription for additional features, such as more courses, no ads, etc.

One big issue is that we were not able to find a concrete privacy policy for this app. The privacy policy link redirects to the privacy policy for another app, “FitGenie” - an app created by FitGenie LLC, which has the same developers as Plutonium Apps LLC – the creators of the Grades app.

Considering that there is no concrete privacy policy, it would be safe to assume that the app does not provide the user with adequate privacy protection. Even if we assume that this app has the same privacy policy as FitGenie, the users’ privacy is not well respected. The FitGenie privacy policy allows for the collection of almost all the users’ data, including location data, biometric data, camera permissions, Facebook account access, google data, and much more. To top it all off, the app is also allowed to sell this data to advertisers to be used for “interest-based advertising”.

It is not too far-fetched to assume that the developers of one app would have similar lapses in attention when it comes to providing the user with proper privacy. We recommend that users stay away from this app.

## Functional Requirements

### System Requirements

- Users should be able to self-host the webapp with relative ease.
  - It should be set up with little more than creating a few files and running a few scripts.
  - Users should not have to create accounts for a DBMS like MongoDB, or manually download dependencies.
  - Assume the user has no computer skills beyond opening and running commands on the terminal, editing a markdown file.
- The frontend of the system will be designed using React (JavaScript).
- The backend of the system will be designed using JavaScript (with Node.js and Express.js).
- The version control will be handled through GitLab (VCS: Git).
- The database for the system will be SQLite.
- User login authentication be handled through JSON Web Tokens.

### Welcome Page Requirements

- The user will be presented with a login panel.
- The login panel will have a username text input box.
- The login panel will have a password text input box.
  - Any text in the password input textbox will be displayed in an obfuscated manner, i.e., not plaintext.
- The login panel will have a “login” button.
  - Upon click of the “login” button, the system will verify if the input passed by the user in the previous text input boxes is valid.
  - If the username and/or password is missing, the user will be told to enter it.
  - If the username/password combination is valid, the user will be redirected to their dashboard.
  - If the username/password combination is invalid, the user will be told the combination was invalid.
- The login panel will have a “register” button.
  - Upon click of the “register” button, the user will be redirected to the register page.

### Registration Page Requirements

- The user will be presented with a registration panel.
- The registration panel will have a username text input box.
- The registration panel will have a password text input box.
  - Any text in the password input textbox will be displayed in an obfuscated manner, i.e., not plaintext.
- The registration panel will have a email text input box.
  - The user may leave this section blank, and still proceed with account registration (email is optional).
- The registration panel will have a checkbox that the user must check to indicate that they agree to the privacy policy.
- The registration panel will have a “register” button.
  - Upon click of the “register” button, a new account is created with the information provided by the user in the previous input boxes. This account is then stored safely in the database. The user is then notified that their account was created successfully and redirected to the login page.
  - If the username and/or password is missing, the user will be told to enter it.
  - If the checkbox is not checked, the user will be told to check it.
- The registration panel will have a “login” button.
  - Upon click of the “login” button, the user will be redirected to the welcome page.

### User Dashboard Requirements

The user dashboard is divided into three columns:

- [Sidebar Section](#sidebar-section)
- [Course Information Section](#course-information-section)
- [Grade Information Section](#grade-information-section)

#### Sidebar Section

The sidebar section is equivalent to the dashboard menu. It contains the system logo, the list of semesters, the list of courses (for the current semester, if one is selected), and the user information.

- The sidebar will have the system logo
- The sidebar will contain a list of the user’s semesters.
  - The list will have a header titled “Semesters”.
  - The list will display all the semesters stored in the user’s database.
  - The user will be able to click any of the displayed semesters to select one.
    - The user will only be able to select one semester at a time. If a new semester is selected, the previous selected semester is unselected.
  - The user will be presented with a “+” button, placed adjacent to the header of the list.
    - On click of this button, the grade information section will display a panel to create a new semester.
      - The user has to enter the name of the semester in the text input box.
      - There will be a “Create” button. On click of this button, the system will create a new semester for the user with the given name. The system will verify that the semester does not already exist in the user’s database. The system will add this new semester to the user’s database.
        - If the new semester already exists in the user’s database, then no new semester is added and instead the user is told that the semester already exists.
        - If no name is provided, then the user is told to enter a semester name.
- The sidebar will contain a list of courses (underneath the list of semesters).
  - The list will have a header titled “Courses”
  - The list will display all the courses stored in the user’s database, for the semester they currently have selected.
    - If no semester is selected, the list should be empty
  - The user will be able to click any of the displayed courses to select one.
    - The user will only be able to select one course at a time. If a new course is selected, the previous selected course is unselected.
  - The user will be presented with a “+” button, placed adjacent to the header of the list.
    - On click of this button, the grade information section will display a panel to create a new course.
      - The user has to enter the course name, number of credits and description in the corresponding text input boxes.
      - There will be a “Create” button. On click of this button, the system will create a new course for the user with the given information (description is optional). The system will verify that the course does not already exist in the user’s database. The system will add this new course to the user’s database.
        - If the new course already exists in the user’s database, then no new course is added and instead the user is told that the course already exists.
        - If no course name or number of credits is provided, then the user is told to enter the missing information.
- The user will be presented with their username to allow the user to verify the current account they are logged into.
- Below the username, the user will be presented with a “Account Settings” button.
  - Upon click of this button, the user will be redirected to their account settings page.
- The user will be presented with a “Sign Out” button.
  - Upon click of the “Sign Out” button, the user will be signed out of their account, and redirected to the login page.
- The user will be presented with a “About and Privacy” button.
  - Upon click of this button, the user will be redirected to the privacy policy page.

#### Course Information Section

The course information section displays information related to the selected course (grade categories and grade items).

- If no course is selected, the whole section displays the following message: “Please select a course and semester”
- The top of the section will display the course name and the course information
  - In the course information subsection, there will be the course grade (computed from the weighted sum of the course categories)
  - In the course information subsection, there will be the course GPA (computed from the course grade)
  - In the course information subsection, there will be the number of credits for the course
  - When hovering on the top of the section, a “+” buttons appear to add a category
    - On click of this button, the grade information section will display a panel to create a new category
      - The user has to enter the category name, weight and description in the corresponding text input boxes.
      - There will be a “Create” button. On click of this button, the system will create a new category for the user with the given information (description is optional). The system will verify that the category does not already exist in the user’s database. The system will add this new category to the user’s database.
        - If the new category already exists in the user’s database, then no new category is added and instead the user is told that the category already exists.
        - If no category name or weight is provided, then the user is told to enter the missing information.
- The rest of the section will display a list of the course’s categories
  - A category is defined by the user and contains the following information:
    - A name
    - A description
    - A list of evaluations
    - A weight
  - Each grade category will display a list of grade items.
    - Each grade item contains the following information:
      - A name
      - A mark
      - A maximum mark
      - A weight
      - A date
      - A description
  - Each course category will have a “+” button adjacent to the name.
    - On click of this button, the grade information section will display a panel to create a new grade item (of the given category).
      - The user has to enter the grade item’s name, weight, mark, maximum mark, date and description.
      - There will be a “Create” button. On click of this button, the system will create a new grade item for the user with the given information (description is optional). The system will verify that the grade item does not already exist in the user’s database. The system will add this new grade item to the user’s database.
        - If the new grade item already exists in the user’s database, then no new grade item is added and instead the user is told that the grade item already exists.
        - If no grade item name, weight, mark, maximum mark or date is provided, then the user is told to enter the missing information.
- The user will be able to select a category or a grade item.
  - The user will only be able to select one category or grade item at a time. If a new category or grade item is selected, the previous selected category or grade item is unselected.

#### Grade Information Section

The grade information section displays information related to the selected grade item. This section is also used to create new items (new semesters, courses, categories and grade items).

- If no grade item is selected, the whole section displays the following message: “Select something to see more details or to modify it”.
- The top of the section will display the grade item name.
- The middle of the section displays the grade item’s information:
  - Grade
    - This subsection displays the grade (in percentage), computed from the obtained grade and the maximum mark
  - Weight
  - Date
  - Category (to which the grade item belongs to)
  - Course (to which the grade item belongs to)
  - Description
- All the displayed information will be editable by the user.
- The bottom of the section will have two buttons
  - A “Delete” button
    - Upon click of this button, the system will permanently delete the grade item from the database (not recoverable).
    - Upon deletion, the grade item is unselected (does not exist anymore)
  - A “Save” button
    - Upon click of this button, the system will update the current grade item’s information.
      - If the grade item’s name was changed to the same name as an existing grade item (from the same category), the grade item is not updated and the user is told that the name already exists.

## Privacy Requirements

### User Knowledge Requirements

- The user will be presented with the privacy policy on the registration of a new account.
  - The user will be required to check a checkbox to acknowledge the fact that they have read and understood the privacy policy.
- The user will be presented with the cookie policy on the registration of a new account
  - The user will be required to click a checkbox to ensure that they have read and understood the cookie policy.
- The user will be told on registration of a new account to not include any personally identifiable information (PII) in any provided information.

### User Settings Requirements

- The user will be able to view all their account data.
- The user will be able to revoke their cookie consent.
- The user will be able to request to download all the data stored related to their account.
  - We need to ensure that this process is fast and should be in the order of minutes to complete.
- The user will be able to permanently delete their account, including all the data related to their account.
  - We need to ensure that this process is immediate and non-reversible.

### Data Storage Requirements

- User data will be stored in databases on their own devices (or the host’s). No external software as a service database used.
- User databases should be encrypted.
- Passwords stored in the database will be salted and hashed.
  - This ensure that the application never has access to the actual password.
- Requests to retrieve data from databases should be minimized.
  - Minimizing the number of queries to the database can diminish the risks of having PII leaked.
- Item descriptions are set to optional.
  - This allows users not to provide a description, which is the main (if not only) source of potential unsolicited PII for our application. We want to avoid storing unsolicited PII as much as possible.

## Server Communication Requirements

- Communications to and from servers must be SSL encrypted.
- The user will be provided with an authentication token (JWT token) upon login, which is stored on their browser.
  - This JWT token is signed to ensure that its payload was not modified.
  - This JWT token will contain the user’s unique identifier.
  - This JWT token will be set to have a short expiration time to minimize attack risks from third parties.
  - For every request made by the user during their session, the JWT token will be used to correctly authenticate the user.
    - This can ensure that a user cannot view, modify, access nor delete another user’s information.

## Privacy By Design

GradeTrackLite is designed with privacy in mind. In this section, we will review the seven principles of privacy by design, and how GradeTrackLite follows those principles.

### 1. Proactive not Reactive; Preventative not Remedial

The first principle aims at making an application with privacy in mind from the very beginning. GradeTrackLite implements this principle by requiring only the necessary user information to have a functional and privacy assured system. By minimizing the amount of data collected, the risks associated with data breaches or unauthorized access are greatly reduced. We also have distinct roadmaps in place to provide the users with even more privacy.

### 2. Privacy as the Default Setting

The second principle aims to ensure that personal data is automatically protected, with no action needed by the individual. In GradeTrackLite, once the account is created, everything in the app is kept private and secure inside the server host’s database. To access the information, users must log in using their username and password and all the account related information cannot be seen by anyone else. We ensure that once the account is created, users do not have to take any more steps to protect their data.

### 3. Privacy Embedded into Design

The third principle aims at ensuring that privacy is an integral part of design and functionality. In GradeTrackLite, we include password salting and hashing, and also implement SSL to encrypt requests made to the server. By implementing these, we hope to provide an extra layer of protection for user data.

### 4. Full Functionality

The fourth principle is Full functionality. We recognized that data privacy does not have to come at the cost of functionality. We design GradeTrackLite with a positive-sum approach, meaning that we provide all the necessary features to help users keep track of their academic progress while ensuring data privacy. Users never have to give any extra personally identifiable information to access any the application’s features.

### 5. End-To-End Security

The fifth principle is End-to-end security, which targets the data’s lifecycle. In other words, how data is collected, retained and deleted. All data that GradeTrackLite collects is stored in a file on the host server’s database. When an account is created, nothing is stored in that file, no assumptions, no inferences. Then, when a user wants to make changes to the account, we make sure that the request made to the server is paired with an authorization token that is stored in the user’s browser as a cookie. Finally, for data deletion, users can delete everything related to the account, including the account itself.

### 6. Visibility and Transparency

The sixth principle is Visibility and Transparency, which aims at being open about how personal information is collected, used, and shared. The version of the application that we host ourselves makes sure that there are no user activity logs in our system, and that the data stored in our database will never be accessed by anyone without user consent. This information is also all stated in the privacy policy, which the user must read and agree to before making an account.

### 7. Respect for User Privacy

The seventh and final principle is the Respect for User privacy, which aims at allowing users to manage their data easily. In GradeTrackLite, we implement this principle by giving users the ability to add and delete account information such as courses and grades. They also have the option to download all their account data and delete their account at the click of a button without the possibility of the server host blocking it. Overall, once users make an account, they have full control over their data.

## References:

[^gbpp]: Gradebook, "Privacy Policy", gradebook.app, https://www.gradebook.app/privacy-policy/

[^nspp]: NSouthProductions, "Privacy policy", google.com, https://docs.google.com/document/d/1MGbZkGkwpGMQMERZSvQVBgqkqC86fMtNWRYxDBYwoTw/edit

[^pfpp]: Pollfish Respondent privacy policy - https://www.pollfish.com/terms/respondent

[^fgpp]: FitGenie Privacy Policy - https://www.iubenda.com/privacy-policy/50447321
