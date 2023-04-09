# Requirements
# System Purpose and Scope

GradeTrackLite is a privacy-minded, user-friendly academic grade tracking web application. It is designed to allow students to have a straightforward way to track their grades, compute future grade requirements, and keep track of important academic dates. GradeTrackLite is accessible via web login using user credentials and does not store any user PII on its own databases (aside from the required username and password), allowing users to retain full control over their data storage. GradeTrackLite is **not** intended to replace grade distribution and viewing systems like MyCourses, but rather to be used in coordination with these services, to provide students with additional tools to aid academic success. By minimizing data collection, empowering users to control their data storage and implementing data security measures, GradeTrackLite provides users with a greater sense of privacy and security.

# Sample Systems

There are many synchronised grade tracking apps (grades accessible from anywhere). We searched “Grade Tracking App” on Google and picked 3 from the first page, which is what most users would likely find as well. We picked **Gradebook**, **Grade Tracker Pro**, and **Grades – Grade Calculator, GPA**.

## Gradebook

Gradebook is a system that provides similar functionality to our application – it allows users to input classes, grades, and other information, perform calculations, and make predictions about future grades.

Like GradeTrackLite, Gradebook is also created by students, which might explain the fact that it provides reasonable data privacy and security measures. However, the application still collects some personally identifiable information (PII), including the user’s first and last name, Google identifier, email address and school [1]. On the other hand, GradeTrackLite strictly collects the user’s username and password (to be exact, a salted and hashed version of the password, rather than the password itself). Although Gradebook claims that this data is used for “basic functionality”, it does not seem necessary for the application’s operation to require the user’s name and school. While Gradebook’s developers claim not to sell user data, they do admit to “work[ing] directly with local advertisers to ensure relevant advertising for [their users]” [1], likely using the user’s school as location data.

Gradebook allows schools to view anonymized data related to them and request to view an individual’s data (with user approval). Gradebook also claims that users can delete their data at any time, and that it will be permanently deleted (data cannot be recovered). However, Gradebook stores all user data on its servers, which could be compromised in the event of a data breach. Furthermore, it is currently unknown whether Gradebook encrypts its user data. On the other hand, GradeTrackLite allows its users to have their own personal database, stored locally on their personal machine. Additionally, we plan to encrypt user data to add an extra layer of security.

Overall, Gradebook seems to be fairly well privacy minded, and provides a good service to its users, for free, making it a reasonable alternative for users who do not mind handing over their name, Google identifier, email and school data and having this information stored on servers.