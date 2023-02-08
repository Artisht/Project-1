const mysql = require("mysql2/promise") 

async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project 1",
  })
}

