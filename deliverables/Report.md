# Overview of the System

## Introduction
GradeTrackLite is a grade tracking system designed to help students keep track of their academic performance by allowing them to input and store their course grades, credits, and other academic information in a secure and easy-to-use platform. The system is a web application that can be accessed from any device with an internet connection.

The need for such a system also arises from the fact that students are often required to keep track of their academic performance manually, which can be time-consuming and prone to errors. GradeTrackLite provides a user-friendly and efficient alternative that simplifies the process of monitoring academic progress, while ensuring their privacy. To realize this project, we chose to provide an app that would not centralize the collected data into one monolithic entity or service provider. In practice, we wanted to give our users the option to locally host the service on their device while we would also host an instance with the same functionalities. On the surface, the different instances of GradeTrackLite are the same, but behind the scenes, that is where the privacy practices start to diverge as each host has their own.

## Context
To start the development process, we first needed to know what was on the market for **synchronized** grade tracking apps. By familiarizing ourselves with other [similar grade tracking applications](./Requirements.md#sample-systems), we concluded for most of these applications, though they provide good services in this field, provide terrible looks about their privacy practices. It is clear that privacy is not high on the priority list for these apps, perhaps because grades aren't seen to be as private as other types of data. Not only that, but many of them indiscriminately collect more data that are not only unneeded, but are also entirely unrelated to the goal of grade tracking. In our app, we figured a way to provide all the required functionalities of a grade tracking application without having resort to suboptimal privacy practices.

After inspecting other applications, we designated two types of stakeholders for our application: the [users and the service host](./Architecture.md#stakeholders). As a reminder, we host a version of GradeTrackLite, as a result, we are the hosts. However, hosts do not have accounts with superior permissions, or accounts at all; they are simply the owners and managers of the infrastructure on which the app is running. In fact, all accounts are equal. Accounts are reserved for users, whom we hope are students as would fit the purpose of our application. Because GradeTrackLite is a "grade tracking" application, it should only have grade tracking functionalities, requiring the least amount of PII possible.

## Functionality
The account creation process of our application is very simple: click “register”, enter a username and a password, confirm the password and acknowledge that you have read the terms and conditions/privacy policy. As can be seen, aside from the username-password combination, no personally identifiable information is required; one can also simply not put any PII in their usernames. In the first few iterations of our application’s design, we gave the option to input an email address, but we have since removed that, and we delve into its explanation in a [later section](#lessons-learned).

The functionalities of the application are strictly for tracking grades and courses in a semester. Such [core functionalities](./Requirements.md#course-information-section) include being able to add a semester, a course and a grade, one respectively inside the other. Likewise, we also allow users to delete those components. As for [privacy related functionalities](./Requirements.md#user-settings-requirements), we give our users the ability to fully control their data, such as modifying their account information, downloading their user data, deleting their account and revoking cookie consent.

To ensure our application provides an efficient and privacy-ensured way for students to keep track of their academic progression, we carefully implemented the 7 principles of Privacy by Design by always thinking about what could potentially put our user’s data at risk and what we could do to prevent it. As a whole, our application is fully functional and privacy-ensured, meeting the needs and requirements of users for a secure and efficient grade tracking system.

# Design and Implementation

In this section, we will present a systematic but narrative description of the salient technical aspects of GradeTrackLite. This includes major architecture, design, and implementation decisions, choices of technologies, limitations, and trade-offs.

GradeTrackLite utilizes a client-server model, with React serving as the front-end library for building the user interface, and JavaScript, Node.js, and Express.js to implement the back-end. For the database, we chose SQLite as our primary data storage solution.

## Front-end implementation

GradeTrackLite is built upon a client-server model, using React as its front-end library. We decided to use React as our front-end technology because it provides a quick and easy way to build our application thanks to its component-based architecture. By using components, we were able to build a user interface quickly, without having to constantly rewrite code for similar sections. This allowed us to build a better UI within the limited time frame (it also helps us avoid the duplicate code antipattern).

As we mentioned in our [Architectural Design Choices](./Architecture.md#architectural-design-choices), although React is made by Meta, we believe it has no inherent privacy risks because it is not only open-source, but also extremely popular. We believe that security vulnerabilities and any attempt to introduce hidden data collection would be discovered very quickly and widely publicized. We applies the same philosophy (popular and open-source) to the libraries we use in addition to React.


The frontend adheres to a philosophy of data minimization, where the bare minimum of data is collected for the specified purpose. No data collection happens in the background, and data is only collected with the consent of the user (such as when they press the "save" button). In addition, it also tries to minimize the amount of data being transferred. Instead of sending all the data held about a user on page load for easier coding (realistically, the total amount of data we could hold on one user is likely small enough for this to be viable), we send the all the data concerning a course on selecting that course from a list only. The information concerning the other courses are not sent unless the user selects them.

Furthermore, we aimed to conform to the user's browser privacy preferences. This means using cookies instead of local or session storage as cookies are more likely to be impacted by privacy settings, and minimizing the amount of cookies stored to the bare minimum of two (token and theme), with the theme cookie being opt-in only.

To improve user experience, we implemented features such as dark/light mode toggle. To make it easy for users to locate their privacy choices, links to the account settings and terms of service and privacy policies (about page) are visible at all times on the dashboard. There is no intention to hide the settings away.

## Back-end implementation

We needed a way to seamlessly integrate our back-end with the front-end. To do this, we decided to implement the back-end of GradeTrackLite using JavaScript, Node.js, and Express.js (as explained in the [architechture deliverable](./Architecture.md#backend)). Thus, using JavaScript as the primary programming language allowed a smooth development experience when team members had to switch between front and back end development taks.

Node.js provides a runtime environment for executing JavaScript code on the server-side, while Express.js is a lightweight web application framework that simplifies the process of building RESTful APIs, which also helped with the rapid and easy development of our application within the given time frame. We designed our back-end to handle user authentication, data processing, and communication with the database.

Whereas the focus of the frontend was to minimize the amount of data collected, the focus of the backend was to ensure the security of the data entrusted to the app from being accessed by illegitimate users. To this end, we implemented a JSON Web Tokens, or JWT tokens, based authentication system, which allows the application to securely transmit information between the front-end and back-end in a compact, self-contained manner. In other words, the token contains the user's identifier and expiration date, and a signature to protect against tampering or forgery, removing the need for us to store tokens as we can trust the authenticity of valid tokens.

Although optional (more on that later), the use of SSL/TLS encryption ensures secure data transfers in transit between the client and the server, protecting sensitive user data from being intercepted by third parties.

User registration and login are designed with security in mind. The application provides a generic error message for both invalid username and password combinations during the login process, preventing potential attackers from determining whether a username exists in the system in either targeted or brute-force attacks. Additionally, the decision to remove the optional email field during registration reduces the amount of personally identifiable information (PII) stored in the system, further enhancing user privacy.

Middlewares are used to verify JWT tokens and ensure that users have the appropriate permissions to access specific resources within the application. These middleware functions validate that the JWT tokens are valid, not expired and contain the correct payload information, ensuring that the user is both authenticated and authorized. Using them massively reduces on the amount of code duplication.

## Database Implementation

For the database, we chose SQLite as our primary data storage solution. SQLite is an embedded, serverless, and self-contained SQL database engine, which makes it an ideal choice for a lightweight and easy-to-deploy application like GradeTrackLite.

The database is structured into a series of tables with relationships defined by foreign keys. The table hierarchy consists of tables for users, semesters, courses, grade categories, and grade items. The tables are linked through foreign keys in a cascading manner, with the semesters table referencing the user table, the courses table referencing the semesters table, and so on. This structure reduces the risk of errors and follows best practices to avoid the "Temporary Field Antipattern" (for example, all tables holding a foreign key to the users table).

To ensure data consistency and simplify deletion operations, we implemented the "ON DELETE CASCADE" constraint on the foreign key relationships. This ensures that when a user, semester, course, grade category, or grade item is deleted, all related records with a foreign key to the deleted element are automatically deleted as well, and so on. This is an effective guard against the risk of forgetting to delete some data.

The initial idea, as stated in the [architecture deliverable](./Architecture.md#storage), was to use SQLite for the database while prototyping, and then use a variant to encrypt the database to enhance its security. We identified SQLCipher, an open-source SQLite extension that provides transparent 256-bit AES full database encryption, as our preferred variant as it was the most popular [^sqlcipher].

[^sqlcipher]: Zetetic, "SQLCipher", zetetic.net, https://www.zetetic.net/sqlcipher/

However, we ultimately didn't use an encrypted version/extension of SQLite because doing so would require great sacrifices, either in terms of security or by undermining the goals of the app. Of note is that SQLite isn't a database software per-se, rather it is a collection of libraries to read and write to the database file available for many programming languages. Since we're using JavaScript, while there are trusted open-source and popular implementations of SQLite for JS, there are no compelling options for a SQLCipher or any of the other encrypted variants.

An option would be using unpopular libraries with very low download amounts and repository traffic. This means its safety and trustworthiness are potentially lesser than those of heavily scrutinized larger libraries. In addition, finding resources for using them would be harder. As we did not want to betray the goal of using popular, open-source libraries, we did not go that route.

Another option would be to compile the popular SQLite3 library ourselves for use with SQLCipher. However, to do so, we would need to compile it against SQLCipher, which would need to be somewhere on the system. We would then need to either massively increase installation instructions so that those who clone our repository can compile it themselves, or we could bundle the compiled binaries (massively increasing its size and making it platform dependent). Both these options go against the design goals of the app which is to be set up relatively quickly by users who are not advanced. They already need to juggle keys/secrets for JWT and SSL, adding more is not advisable.

Due to these problems, we decided to not encrypt the database, especially since alternatives such as MongoDB don't offer encryption at rest on non-enterprise plans anyway. However, this is a good feature that warrants future exploration.

## Deployment and Hosting

GradeTrackLite is designed to be easily deployable and self-hosted. Users can clone the repository and have a working instance of the application with minimal setup. By default, the application uses HTTP for communication, but we also provide the option to use HTTPS by following the steps detailed in a separate markdown file. This enables users to set up secure connections with SSL/TLS encryption, further enhancing the privacy and security of the application. 

While it would be preferrable from a privacy-by-default point of view to enable HTTPS by default, it is not a setting that can simply be toggled. To enable it requires the host to supply their own keys and certificates. We compromised by making the build script print instructions to generate a self-signed key, and print a link to Certbot where the host can get more information on how to certify their key from the Let's Encrypt root authority [^certbot]. Finally, the app prints a warning if it is started without HTTPS enabled.

[^certbot]: Electronic Frontier Foundation, "get your site on https://", eff.org, https://certbot.eff.org/

The self-hosting feature of GradeTrackLite is intended for users such as: individual users who wish to track their own grades, smaller educational institutions that want to provide a grade tracking solution for their students, or parents. By allowing users to host their own instances of the application, we give them the option for total control over their data and minimize the need for third-party data storage services such as MongoDB.

To be more specific, the **host is the data controller** for their users. As such, we allow hosts to provide their own privacy policies and terms of use. More importantly, we designed the back end such that it would **not facilitate data collection on the part of the host** such as collecting the bare minimum amount of data to begin with, not keeping logs, not offering a toggle to start collecting logs, etc. Users should still assess whether they trust the host, the same as whether they should trust our hosted version or any host on the internet. 

## Wrapping up
In conclusion, the design and implementation of GradeTrackLite prioritize user privacy and security, while keeping ease-of-use in mind. By using modern web technologies like React, Node.js, Express.js, and SQLite, we have developed a lightweight and scalable grade tracking solution that can be self-hosted and easily deployed. While there are some limitations, such as the decision not to encrypt the database, the overall design of GradeTrackLite represents a balance between the need for privacy and the realities of development and deployment.

# Discussion

## Fitness for Purpose

When evaluating any software tool, it is essential to consider its fitness for purpose, and this applies to our privacy-preserving application, GradeTrackLite. One key factor in evaluating it is to compare our application to alternatives that exist in the current technology ecosphere. When compared to alternatives such as Gradebook, Grade Tracker Pro, and Grades – Grade Calculator, GPA, we strongly believe that our application stands above all others in terms of privacy and meets the requirements that define a grade tracking application. Arguments could be made once more about the use of React and JavaScript, and how they could introduce certain privacy concerns, but it is to note that we took them into account when developing our application, taking careful steps to mitigate these risks as much as possible.

## Utility vs Privacy

While there are times when the argument that data collection limitation significantly decreases utility, such as in health-related applications, we believe that this argument does not apply very well for a grade tracking application. Indeed, limiting the breadth of data collected does not significantly impact the app's ability to fulfill its purpose. However, there are a few decisions we made that arguably decrease privacy or security in favour of utility.

The largest decision in the debate of utility versus privacy is the already discussed topic of HTTPS vs HTTP. Forcing HTTPS would make data privacy much higher, but at the cost of betraying the the design goal of making self-hosting accessible to non-advanced computer users. When such decisions must be made, we usually defaulted to letting the user (in this case, the host) decide if they want to give up convenience for more privacy.

By using JSON Web Tokens instead of regular tokens (random number and associated identifier stored in a token table in the database), we likely increase the security of the authentication process since instead of being a mere randomly generated number, JWTs are signed and are backed by a large community to probe it for flaws. However, by using JWTs, we also incur some security and privacy losses compared to normal tokens. In particular, since JWTs are self-contained, they must contain the token's owner's identifier in their payloads. This means that JWTs will forever hold potentially private information (username) even after they expire as they can be decoded at any time. In addition, should a token be stolen, unlike regular tokens whose entry in the token table can simply be removed, invalidating a JWT would require keeping a table with information to invalidate the JWT, defeating the self-contained advantage of JWTs. We do not support invalidating tokens in the prototype of the application.

Furthermore, some features during the planning and preparation phase of our development process were completely ruled out. One feature was to include the IP address of the user in the token and reject it if it is being sent from another IP address, but we quickly abandoned the idea when we remembered that this would be a nightmare for users on mobile devices, in addition to including more personally identifiable information into the token.

Another feature we thought about implementing was the ability to share grades with other users on the platform. To some people, this would be convenient and useful, but to everyone, including those that would benefit from its convenience, this feature would have decreased their privacy. As such, we decided against this feature in favor of maintaining a higher level of privacy protection for our users.

Ultimately, while we focussed the application towards privacy and security, but we did not go to the extremes to make the application as private as possible. We believe that the application provides good privacy to their users without impacting the functionality compared to applications.

## Lessons learned

A lesson we all learned is the importance of assessing privacy risks early in the development process and being proactive about them. At first, in the account registration process, we wanted to give our users the option to [input an email address](./Requirements.md#registration-page-requirements). There were two main reasons why we thought it’d be good to have an email address tied to the user’s GradeTrackLite account. The first was the option of receiving email notices related to potential data/account breaches. We need a way to communicate that issue to the account owners in the case of those events. The second option was for possibility of setting up a two-factor authentication system, using email as the account’s secondary authentication. In the end, we determined that grades and derived information such as a person's academic standing may be sensitive to many users. As such, we should reduce to the bare minimum the amount of PII collected such that the chances of that sensitive information being linked to a person in the event of a breach thanks to the PII in the account is reduced. We realized that there was the possibility of using the app without ever providing any PII by using a non-identifiable username (IPs are not stored). As such, we deemed we should not require, or even give the option to obtain, any additional PII.

In short, we concluded that because our application works perfectly well without any PII (not to be confused with sensitive information), we shouldn’t compromise that privacy feature by adding more potential sources of PII. Thus, during our development process, we completely removed the option for users to enter an email address even though it was never mandatory to begin with.

Another lesson we learned is that ensuring privacy to users while allowing them full control over data is very difficult. There is a balance between security, ease of use, and privacy that is hard to thread. For example, we can ensure higher security by enforcing HTTPS, but doing so already adds significant complexity that the host has to deal with. In addition, security features such as email password recovery increase security at the cost of requiring an email address, which could be personally identifiable. We believe that the compromises we made (no email account recovery, optional HTTPS, etc.) strike a good balance between these three points. There is only so much an average user is likely to want to put up with before they switch to another more convenient service even if they know it is less private.

# References
