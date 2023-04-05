# Prerequisite
- Node.js (version 18.15.0) server
- MySQL database server with created database, username and password

# Instructions to run the code
- Clone the current repository
- Create database tables by running the SQL script found in *teachers-students.sql* file
- Run `npm ci`
- Copy *env.example* to *.env* file and change the variables to appropriate values
- Run `npm start` and the application should start running

# Testing
- Unit test can be run with the command `npm run unit-test`
- Postman collection json file is provided under *test/teachers-students-admin.postman_collection.json*
- End to end API testing using Postman collection can be run with the command `npm run postman-test`