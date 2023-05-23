const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./Database.js");
const port = 3000;

const http = require("http");
const socketIO = require("socket.io");
let server = http.createServer(app);
let io = socketIO(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));



io.on("connection", async (socket) => {
  const count = io.engine.clientsCount;
  console.log("A user just connected.", socket.id, count);

  /*
    let previousData = await db.getMessages();
    Object.keys(previousData).forEach((key) => {
      socket.broadcast.emit("Connection", previousData[key]);
      socket.emit("Connection", previousData[key]);
    })
  */

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });
  
  socket.on("submit", async (data) => {
    // socket.broadcast.emit("messageReceived", data);
    // socket.emit("messageReceived", data);
    const con = await db.getConnection()
    const password = db.hash(data.Password)
    const check = await con.query("SELECT Username AS user FROM data WHERE Username = ?", [data.Username] )
    if (check[0].length > 0){
      socket.emit("TakenUsername")
    }else {
      const send = await con.query("INSERT INTO data (Username, Password) VALUES(?,?)", [data.Username, password])
    }
    await con.end()
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
