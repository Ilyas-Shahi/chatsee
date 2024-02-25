import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import { Chat } from './models/Chat.js';

// Configuration
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
// Creating server instance for socket.io server constructor and allow cors for client origin
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' },
});

// API routes for auth and user
app.use('/user', userRouter);
app.use('/auth', authRouter);

// WebSocket initialization
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  console.log(socket.rooms);
  let currentRoom;
  let currentChat;

  // console.log(socket.handshake);

  socket.on('start-chat', async (room, callback) => {
    console.log('started chat on room', room);

    if (currentRoom) socket.leave(currentRoom);

    currentRoom = room;
    socket.join(room);

    // send previous chat message as response to client
    callback({
      prevChats: await Chat.findOne({ room }),
    });
  });

  socket.on('send', async (data) => {
    console.log('message send', data, currentRoom);
    if (!currentRoom) {
      console.error('no room selected');
      return;
    }

    try {
      // Find the room and add the message to DB, create if doesn't exist
      await Chat.findOneAndUpdate(
        { room: currentRoom },
        { $push: { messages: data } },
        { upsert: true }
      );

      // console.log(currentChat);
      socket.to(currentRoom).emit('receive', data);
    } catch (err) {
      console.error(err);
    }
  });
});

// Server startup
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
