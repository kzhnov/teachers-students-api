const mysql = require("mysql2");

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const dbPool = mysql.createPool({
  host: DB_HOST || "localhost",
  port: DB_PORT || 3306,
  user: DB_USERNAME || "",
  password: DB_PASSWORD || "",
  database: DB_NAME || "",
});

module.exports = dbPool.promise();
