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

  let previousData = await db.getMessages();
  Object.keys(previousData).forEach((key) => {
    socket.broadcast.emit("Connection", previousData[key]);
    socket.emit("Connection", previousData[key]);
  })

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });

  socket.on("submit", (data) => {
    console.log(data);
    socket.broadcast.emit("messageReceived", data);
    socket.emit("messageReceived", data);
    db.addPost(data);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
