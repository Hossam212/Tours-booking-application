# Natours
A tour booking website application for a fictional company called Natours, built using Node.js, express.js, mongoDB and more!

## Features and Functionality

The Natours project includes the following features:

- CRUD operations on tours, reviews, users, and bookings with additional features such as filtering, sorting, pagination, and field limiting.
- Geospatial querying is utilized to locate tours within a specified radius of a particular location.
- User authentication and authorization are implemented using JWT tokens.
- Passwords are protected with encryption from the bcrypt library.
- Password reset functionality is implemented using JWT tokens.
- User roles and permissions are managed (user-admin-lead guide).
- User password reset and forget password are handled.
- Two specific routes are designated for updating the current user's data or password.
- The PostMark API and Mailtrap service facilitate the sending of actual emails to users for new signups and password resets.
- Nested routes enable the retrieval of all reviews and the creation of new reviews for a specific tour.
- Stripe checkout sessions enable the creation of new bookings.
- Stripe webhooks are utilized to handle asynchronous payment events and update booking statuses to prevent fraud.
- Errors and exceptions are handled using global error middleware and error controllers in both development and production environments.
- The catchAsync utility function is used to catch errors in asynchronous functions.
- Unhandled rejections and uncaught exceptions are managed.
- Multer and sharp packages are utilized for image upload and processing.
- Advanced security measures, such as rate limiting and data sanitization, are implemented to prevent security vulnerabilities.
- The Mapbox API is integrated to display tour locations on a map.
- The project's code is organized using the MVC pattern, with Pug template engine for server-side HTML rendering.
- The Parcel bundler is used to bundle JavaScript files.
- The project is deployed to "render.com" hosting platform.
- CORS is enabled to allow requests from other domains.

## Technologies Used

- `Node.js`: a server-side JavaScript runtime environment for building scalable and efficient network applications
- `Express`: a popular Node.js web application framework for building APIs and web applications
- `MongoDB`: a popular NoSQL database for storing and querying large volumes of unstructured data
- `Mongoose`: an Object Data Modeling (ODM) library for MongoDB and Node.js that provides a more intuitive way to interact with MongoDB
- `JWT`: a widely-used standard for representing and transmitting secure authentication and authorization information
- `Stripe`: a payment processing platform for securely processing credit and debit card payments
- `Mailtrap`: an email testing service that helps developers test email notifications without sending them to real users
- `Mapbox`: a popular location data platform for building location-based applications and services
- `Pug`: a template engine for Node.js that makes it easy to create HTML templates with JavaScript
- `Postmark`: a transactional email service for sending emails to real users
- `CSS`: a style sheet language used for describing the presentation of a document written in a markup language such as HTML
- `Multer`: a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files
- `Sharp`: a Node.js image processing library for resizing and optimizing images
- `cloudinary`: a cloud service that offers a solution to a web application's entire image management pipeline
- `parcel`: a web application bundler for JavaScript and CSS
