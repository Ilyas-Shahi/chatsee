const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

const userRouter = require('./routes/user.js');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

app.use('/user', userRouter);

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  let currentRoom;

  // console.log(socket.handshake.auth);

  socket.on('start-chat', (room) => {
    console.log('started chat on room', room);

    if (currentRoom) socket.leave(currentRoom);

    currentRoom = room;
    socket.join(room);
    console.log(socket.rooms);
  });

  socket.on('send', (data) => {
    console.log(data);
    socket.to(currentRoom).emit('receive', data);
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log('sever running on port ' + port);
  // MongoDB connection
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('connected to mongodb');
    })
    .catch((err) => console.error(err));
});
