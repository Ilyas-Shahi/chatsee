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
  let currentRoom;
  let currentChat;

  // console.log(socket.handshake);

  socket.on('start-chat', async (room) => {
    console.log('started chat on room', room);

    if (currentRoom) socket.leave(currentRoom);

    currentRoom = room;
    socket.join(room);

    const chatData = await Chat.findOne({ room });
    if (chatData === null) {
      currentChat = await Chat.create({ room });
    } else {
      currentChat = chatData;
    }
    // console.log(socket.rooms);
  });

  // if (chat) {

  // }

  socket.on('send', (data) => {
    console.log('message send', data, currentRoom);
    socket.to(currentRoom).emit('receive', data);
    // storeMessage(data, currentRoom);

    currentChat.messages = [...currentChat.messages, { message: data }];

    currentChat.save();

    console.log(currentChat);
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
