const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const db = require("./Database.js");
const port = 3000;

const http = require("http")
const socketIO = require("socket.io")
let server = http.createServer(app)
let io = socketIO(server)

app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static('public'))

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

io.on("connection", (socket) => {
    const count = io.engine.clientsCount
    console.log("A user just connected.", socket.id, count)
    socket.on("disconnect", () => {
      console.log("A user has disconnected.")
    })

    socket.on("clicked", (data) => {
    socket.broadcast.emit("clientClicked", data)
  })

  app.post("/add-post", function(req, res) { 
    var msg = req.body.message;
    db.getConnection();
    db.addPost(socket.id, msg);
})

})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  