const mysql = require("mysql2/promise");
const crypto = require('crypto');


async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project 1",
  })
}

  // async function addPost(data){
  //   const con = await getConnection()
  //   const password = await hash(data.Password)
  //   const check = await con.query("SELECT Username AS user FROM data WHERE Username = ?", [data.Username] )
  //   if (check[0].length > 0){
      
  //   }else {
  //     const send = await con.query("INSERT INTO data (Username, Password) VALUES(?,?)", [data.Username, password])
  //   }
  //   await con.end()
  // }


function hash(data) {
 const hash = crypto.createHash('sha256');
 hash.update(data);
 return hash.digest('hex')
}


// async function getMessages() {

//   const con = await getConnection()
//   const result = await con.execute("SELECT Username, Password FROM data")  

//   await con.end() 
//   return result[0]
// }

module.exports = {
  getConnection,
  hash,
  // addPost,
  // getMessages,
}