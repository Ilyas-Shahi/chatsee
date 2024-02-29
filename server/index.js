import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import { Chat } from './models/Chat.js';
import { verifySocketToken } from './middleware/auth.js';

// Configuration
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
// Creating server instance for socket.io server constructor and allow cors for client origin
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  cookie: true,
});

// API routes for auth and user
app.use('/user', userRouter);
app.use('/auth', authRouter);

// WebSocket initialization
io.on('connection', (socket) => {
  console.log('======================');
  console.log('socket connected', socket.id);

  const verifiedUser = verifySocketToken(socket);

  if (verifiedUser.id === socket.handshake.auth.userId) {
    let currentRoom;

    // Start a chat room
    socket.on('start-chat', async (data, callback) => {
      const roomID = [data.senderId, data.receiverId].sort().join('-');

      // if sender is authorized then join the room
      if (verifiedUser.id === data.senderId) {
        if (currentRoom) socket.leave(currentRoom); // leave current room on joining a new one

        currentRoom = roomID;
        socket.join(roomID);

        // send previous chat message as response to client
        callback({
          prevChats: await Chat.findOne({ room: roomID }),
        });
      } else {
        socket.emit('auth-error', { message: 'Not authorized to join room' });
        console.error('Not authorized to join room');
      }
    });

    // Listen for new messages, store in db and forward to receiver
    socket.on('send', async (data) => {
      console.log('message send', data, currentRoom);
      if (!currentRoom) {
        console.error('No room selected');
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
  } else {
    console.error('Not Authorized');
    socket.emit('auth-error', { message: 'Not Authorized' });
  }

  // Emit all online users on a socket connection and disconnect
  io.emit('get-online-users', getOnlineUsers());
  socket.on('disconnect', () => {
    io.emit('get-online-users', getOnlineUsers());
  });
});

const getOnlineUsers = () => {
  let onlineUsers = [];

  io.sockets.sockets.forEach((socket) =>
    onlineUsers.push(socket.handshake.auth.userId)
  );

  console.log(onlineUsers);

  return onlineUsers;
};

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
