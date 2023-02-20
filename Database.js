const mysql = require("mysql2/promise");

async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project 1",
  })
}
async function addPost(socketId, message){
  const con = await getConnection()
  const send = await con.query("INSERT INTO data (SocketID, Message) VALUES(?,?)", [socketId, message])
  await con.end()
}

module.exports = {
  getConnection,
  addPost,
}