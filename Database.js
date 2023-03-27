const mysql = require("mysql2/promise");

async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project 1",
  })
}
async function addPost(data){
  const con = await getConnection()
  const send = await con.query("INSERT INTO data (Username, Message) VALUES(?,?)", [data.Username, data.Message])
  await con.end()
}


async function getMessages() {

  const con = await getConnection()
  const result = await con.execute("SELECT Username, Message FROM data")  

  await con.end() 
  return result[0]
}

module.exports = {
  getConnection,
  addPost,
  getMessages,
}