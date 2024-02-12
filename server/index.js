const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('send', (data) => {
    console.log(data);
    socket.broadcast.emit('receive', data);
  });
});

httpServer.listen(3000, () => {
  console.log('sever running');
});
