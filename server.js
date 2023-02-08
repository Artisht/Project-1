const express = require("express");
const app = express();
const db = require("./Database");
const port = 3000;

const http = require("http")
const socketIO = require("socket.io")
let server = http.createServer(app)
let io = socketIO(server)

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
})
  
app.post("/add-post", function(req, res){
    var msg = req.message
    db.getConnection()
    var sql = "INSERT INTO data (socket.id, msg) VALUES ('Socket-id', 'Message')";
    db.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });

//FIXA DENNA FUNKTION.. Ska skicka message från form till databas
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  