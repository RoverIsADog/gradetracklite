# Report

## Overview of the System

GradeTrackLite is a grade tracking system designed to help students keep track of their academic performance by allowing them to input and store their course grades, credits, and other academic information in a secure and easy-to-use platform. The system is a web application that can be accessed from any device with an internet connection.

The need for such a system also arises from the fact that students are often required to keep track of their academic performance manually, which can be time-consuming and prone to errors. GradeTrackLite provides a user-friendly and efficient alternative that simplifies the process of monitoring academic progress, while ensuring their privacy. To realize this project, we had to produce a way to decentralize the collective data. In short, we wanted to give our users the option to locally host the service on their device, while also having a service of our own, containing all the same functionalities. On the surface, the different instances of GradeTrackLite are the same, but behind the scenes, that is where the privacy practices start to diverge.

To start the development process, we first needed to know what was on the market. By familiarizing ourselves with other [similar grade tracking applications](./Requirements.md#sample-systems), we concluded that these applications, though they provide good services in this field, provide terrible looks about their privacy practices, some relying on the privacy policies of third-party services to pose as their own. We needed to do better! Not only are the other applications on the market objectively substandard, we figured a way to provide all the required functionalities of a grade tracking application without having resolve to their privacy practices.

After inspecting other applications, we designated two types of stakeholders for our application: the [users and the service host](./Architecture.md#stakeholders). As a reminder, we host a version of GradeTrackLite, as a result, we are the hosts. However, we do not have accounts that have administrative privileges or superiority over other accounts. In fact, all accounts are equal. Said accounts are reserved for users, whom we hope are students as would fit the purpose of our application. Because GradeTrackLite is a “grade tracking” application, it should only have grade tracking functionalities, requiring the least amount of PII possible.

To this end, the account creation of our application is very simple: click “register”, enter a username and a password, confirm the password and acknowledge that you have read the terms and conditions/privacy policy. As you can see, aside from the username-password combination, no personally identifiable information is required. In the first few iterations of our application’s design, we gave the option to input an email address, but we have since removed that, and we delve into its explanation in a [later section](#lessons-learned).

The functionalities of the application are strictly for tracking grades and courses in a semester. Such [core functionalities](./Requirements.md#course-information-section) include being able to add a semester, a course and a grade, one respectively inside the other. Likewise, we also allow users to delete those components. As for [privacy related functionalities](./Requirements.md#user-settings-requirements), we give our users the ability to fully control their data, such as the downloading their user data, deleting their account and revoking cookie consent.

To ensure our application provides an efficient and privacy-ensured way for students to keep track of their academic progression, we carefully implemented the 7 principles of Privacy by Design by always thinking about what could potentially put our user’s data at risk and what we could do to prevent it. As a whole, our application is fully functional and privacy-ensured, meeting the needs and requirements of users for a secure and efficient grade tracking system.

## Design and Implementation

In this section, we will present a systematic but narrative description of the salient technical aspects of GradeTrackLite. This includes major architecture, design, and implementation decisions, choices of technologies, limitations, and trade-offs.

GradeTrackLite utilizes a client-server model, with React serving as the front-end framework for building the user interface, and JavaScript, Node.js, and Express.js to implement the back-end. For the database, we chose SQLite as our primary data storage solution.

### Front-end implementation

GradeTrackLite is built upon a client-server model, using React as its front-end framework. We decided to use React as our front-end technology because it provides a quick and easy way to build our application thanks to its component-based architecture. By using components, we were able to build a user interface quickly, without having to constantly rewrite code for similar sections. This allowed us to build a better UI within the limited time frame (it also helps us avoid the duplicate code antipattern).

As we mentioned in our [Architectural Design Choices](./Architecture.md#architectural-design-choices), because React is an open-source library, a lot of the privacy concerns associated with third-party packages required us to be wary of the external resources we’re using, but also could be audited by privacy experts, whom we relied on to proceed with the development process.

To improve user experience, we implemented features such as dark/light mode toggle and made it easy for users to locate the account settings, terms of service, and privacy policy within the application.

### Back-end implementation

We needed a way to seamlessly integrate our back-end with the front-end. To do this, we decided to implement the back-end of GradeTrackLite using JavaScript, Node.js, and Express.js (as explained in the [architechture deliverable](./Architecture.md#backend)). Thus, using JavaScript as the primary programming language allowed a smooth development experience.

In addition, Node.js provides a runtime environment for executing JavaScript code on the server-side, while Express.js is a lightweight web application framework that simplifies the process of building RESTful APIs, which also helped with the rapid and easy development of our application within the given time frame.

We designed our back-end to handle user authentication, data processing, and communication with the database. To ensure the privacy and security of user data, we implemented JSON Web Tokens, or JWT tokens, for authentication, which allows the application to securely transmit information between the front-end and back-end in a compact, self-contained manner. The use of SSL/TLS encryption ensures secure communication between the client and the server, protecting sensitive user data from being intercepted by malicious third parties.

User registration and login are designed with security in mind. The application provides a generic error message for both invalid username and password combinations during the login process, preventing potential attackers from determining whether a username exists in the system. Additionally, the decision to remove the optional email field during registration reduces the amount of personally identifiable information (PII) stored in the system, further enhancing user privacy.

Middleware functions are used to verify JWT tokens and ensure that users have the appropriate permissions to access specific resources within the application. These middleware functions validate that the JWT tokens are valid, not expired and contain the correct payload information, ensuring that the user is both authenticated and authorized.

### Database Implementation

For the database, we chose SQLite as our primary data storage solution. SQLite is an embedded, serverless, and self-contained SQL database engine, which makes it an ideal choice for a lightweight and easy-to-deploy application like GradeTrackLite.

The database is structured into a series of tables with relationships defined by foreign keys. The table hierarchy consists of the user table, semesters table, courses table, grade category table, and grade item table. The tables are linked through foreign keys in a cascading manner, with the semesters table referencing the user table, the courses table referencing the semesters table, and so on. This structure reduces the risk of errors and follows best practices to avoid the "Temporary Field Antipattern" (for example, all tables holding a foreign key to the users table).

To ensure data consistency and simplify deletion operations, we implemented the "ON DELETE CASCADE" constraint on the foreign key relationships. This ensures that when a user, semester, course, grade category, or grade item is deleted, all related records in the subsequent tables are automatically deleted as well.

The initial idea, as stated in the [architecture deliverable](./Architecture.md#storage), was to use SQLite for the database, and then use a variant to encrypt the database to enhance its security. We identified SQLCipher as our preferred solution. [SQLCipher is an open-source SQLite extension that provides transparent 256-bit AES full database encryption](https://www.zetetic.net/sqlcipher/).

We didn't use an encrypted version/extension of SQLite because doing so would require great sacrifices, either in terms of security or by undermining the goals of the app. The most popular open-source implementation of SQLite is SQLCipher. Of note is that SQLite isn't a database software per-se, rather it is the specifications of a database file, with libraries to read and write to that file available for many languages. Since we're using JavaScript, while there are trusted open-source implementations of SQLite for JS, there are no compelling options for a SQLCipher.

An option would be using unpopular libraries with very low download amounts and repository traffic. This means its safety and trustworthiness are potentially lesser than those of heavily scrutinized larger libraries. In addition, finding resources for using them would be harder.

Another option would be to compile the popular SQLite3 library ourselves for use with SQLCipher. However, to do so, we would need to compile it against SQLCipher, which would need to be somewhere on the system. We would then need to either massively increase installation instructions so that those who clone our repo can compile it themselves, or we could bundle the compiled binaries (massively increasing its size and making it platform dependent). Both these options go against the design goals of the app which is to be set up relatively quickly by users who are not advanced. They already need to juggle keys/secrets for JWT and SSL, adding more is not advisable.

Due to these problems, we decided to not encrypt the database, especially since alternatives such as MongoDB don't offer encryption at rest on non-enterprise plans anyway. However, this is a good feature that warrants future exploration.

### Deployment and Hosting

GradeTrackLite is designed to be easily deployable and self-hosted. Users can clone the repository and have a working instance of the application with minimal setup. By default, the application uses HTTP for communication, but we also provide the option to use HTTPS by following the steps detailed in a separate markdown file. This enables users to set up secure connections with SSL/TLS encryption, further enhancing the privacy and security of the application.

The self-hosting feature of GradeTrackLite is intended for individual users who wish to track their own grades or for educational institutions that want to provide a grade tracking solution for their students. By allowing users to host their own instances of the application, we give them greater control over their data and minimize the need for third-party data storage services.

In conclusion, the design and implementation of GradeTrackLite prioritize user privacy and security, while keeping ease-of-use in mind. By using modern web technologies like React, Node.js, Express.js, and SQLite, we have developed a lightweight and scalable grade tracking solution that can be self-hosted and easily deployed. While there are some limitations, such as the decision not to encrypt the database, the overall design of GradeTrackLite represents a balance between the need for privacy and the practicalities of development and deployment.

## Discussion

### Fitness for Purpose

When evaluating any software tool, it is essential to consider its fitness for purpose, and this applies to our privacy-preserving application, GradeTrackLite. One key factor in evaluating it is to compare our application to alternatives that exist in the current technology ecosphere. When compared to alternatives such as Gradebook, Grade Tracker Pro, and Grades – Grade Calculator, GPA, we strongly believe that our application stands above all others in terms of privacy and meets the requirements that define a grade tracking application. Arguments could be made once more about the use of React and JavaScript, and how they could introduce certain privacy concerns, but it is to note that we took them into account when developing our application, taking careful steps to mitigate these risks as much as possible.

### Utility vs Privacy

When considering the trade-off between utility and convenience against privacy, it is important for us to find a balance that gives the yields the best user experience. In some cases, users may prioritize convenience over privacy, while some others prefer the other way around. As such, we believe that it is important for us, as the developers of this application, to understand the preferences and priorities of our users and stakeholders, and design GradeTrackLite accordingly.

When designing GradeTrackLite, we were aware that while privacy comes first, we wanted to make sure that our application remained useful to the average user and convenient in its use. To achieve this balance, we made specific design decisions, such as using JSON Web Tokens for user authentication.

By using JWT’s, we were able to provide a secure and reliable method of authenticating users without requiring them to continually enter their login credentials, a task that would be much too tedious and completely disregard convenience. We manage to meet a satisfiable level of privacy by requiring user authentication to access account information while also providing some sort of information retaining to allow users to navigate the application without interruption.

Furthermore, some features during the planning and preparation phase of our development process were completely ruled out. One feature we thought about implementing was the ability to share grades with other users on the platform. To some people, this would be convenient and useful, but to everyone, including those that would benefit from its convenience, this feature would have decreased their privacy. As such, we decided against this feature in favor of maintaining a higher level of privacy protection for our users.

### Lessons learned

A lesson we all learned is the importance of assessing privacy risks early in the development process and being proactive about them. At first, in the account registration process, we wanted to give our users the option to [input an email address](./Requirements.md#registration-page-requirements). There were two main reasons why we thought it’d be good to have an email address tied to the user’s GradeTrackLite account. The first was the option of receiving email notices related to potential data/account breaches. We need a way to communicate that issue to the account owners in the case of those events. The second option was for possibility of setting up a two-factor authentication system, using email as the account’s secondary authentication. Regardless of the benefits of associating an account with an email address, our application doesn’t require any PII’s aside from a username (which is arguably also a PII to some people) and a password, and thus shouldn’t have to require, or even give an option to obtain, any other PII’s. In short, we concluded that because our application works perfectly well without PII’s, we shouldn’t compromise that privacy feature by giving facilitating its potential associated risks. Thus, during our development process, we completely removed the option for users to enter an email address even though it was never required to begin with.

Another lesson we learned is that ensuring privacy to users while allowing them full control over data is very difficult. There is a balance between security, ease of use, and privacy that is hard to thread. For example, we can ensure higher security by enforcing HTTPS, but doing so already adds significant complexity that the host has to deal with. In addition, security features such as email password recovery increase security at the cost of requiring an email address, which could be personally identifiable. We believe that the compromises we made (no email account recovery, optional HTTPS, etc.) strike a good balance between these three points. There is only so much an average user is likely to want to put up with before they switch to another more convenient service even if they know it is less private.

## References

- MongoDB, Comparing SQLite and MongoDB : https://www.mongodb.com/compare/sqlite-vs-mongodb

- SQLCipher: https://www.zetetic.net/sqlcipher/
