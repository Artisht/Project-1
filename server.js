const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;


const rooms = {};


io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('login', (username) => {
    socket.username = username;
    socket.emit('roomList', rooms);
  });

  socket.on('createRoom', (roomName) => {
    const roomId = generateRoomId();
    const newRoom = {
      id: roomId,
      name: roomName,
      users: {},
      messages: []
    };
    rooms[roomId] = newRoom;

    socket.join(roomId);
    io.emit('roomList', rooms);

    console.log(`Room "${roomName}" created with ID: ${roomId}`);
  });

socket.on('joinRoom', (roomId) => {
    if (rooms.hasOwnProperty(roomId)) {
      socket.join(roomId);
      rooms[roomId].users[socket.id] = socket.username;

      const roomMessages = rooms[roomId].messages;
      if (roomMessages.length > 0) {
        socket.emit('roomJoined', roomMessages);
      }
  
      io.emit('roomList', rooms);
      console.log(`User ${socket.username} joined Room ID: ${roomId}`);
    }
  });


  socket.on('leaveRoom', (roomId) => {
    if (rooms.hasOwnProperty(roomId)) {
      socket.leave(roomId);
      delete rooms[roomId].users[socket.id];

      io.emit('roomList', rooms);
      console.log(`User ${socket.username} left Room ID: ${roomId}`);
    }
  });

  socket.on('sendMessage', (data) => {
    const roomId = data.room;
    if (rooms.hasOwnProperty(roomId)) {
      const messageData = {
        username: socket.username,
        message: data.message
      };
      rooms[roomId].messages.push(messageData);

      io.to(roomId).emit('message', messageData);
      console.log(`Message sent to Room ID: ${roomId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    for (const roomId in rooms) {
      if (rooms.hasOwnProperty(roomId) && rooms[roomId].users.hasOwnProperty(socket.id)) {
        delete rooms[roomId].users[socket.id];
        io.emit('roomList', rooms);
        console.log(`User ${socket.username} left Room ID: ${roomId}`);
      }
    }
  });
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
