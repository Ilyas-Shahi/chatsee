import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { authRouter, userRouter } from './routes/index.js';
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
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
  cookie: true,
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// API routes for auth and user
app.use('/user', userRouter);
app.use('/auth', authRouter);

// WebSocket initialization
io.on('connection', (socket) => {
  const verifiedUser = verifySocketToken(socket);

  if (verifiedUser?.id === socket.handshake.auth.userId) {
    let currentRoom;

    // Start a chat room
    socket.on('start-chat', async (data, callback) => {
      // if sender is authorized then join the room
      if (verifiedUser.id === data.senderId) {
        if (currentRoom) socket.leave(currentRoom); // leave current room on joining a new one

        currentRoom = data.roomId;
        socket.join(data.roomId);

        // send previous chat message as response to client
        const roomDb = await Chat.findOne({ room: currentRoom });
        callback({
          prevChats: roomDb?.messages,
        });
      } else {
        socket.emit('error', {
          type: 'auth-error',
          message: 'Not authorized to join room',
        });
        console.error('Not authorized to join room');
      }
    });

    // Listen for new messages, store in db and forward to receiver
    socket.on('send', async (data, callback) => {
      if (!currentRoom) {
        socket.emit('error', {
          type: 'room-error',
          message: 'No room selected',
        });
        console.error('No room selected');
        return;
      }

      try {
        // Find the room and add the message to DB, create if doesn't exist
        await Chat.findOneAndUpdate(
          { room: currentRoom },
          {
            $push: { messages: data },
            $set: { activity: { lastMessage: data, status: 'sent' } },
          },
          { upsert: true }
        );

        // Send the message to recipient joined the room
        socket.to(currentRoom).emit('receive', data);
        // Emit an event for the room activity to show/update notifications
        io.emit(`${currentRoom}-activity`);
        // send callback to acknowledge message sent/got to server
        callback({ sent: true });
      } catch (err) {
        socket.emit('error', {
          type: 'send-error',
          message: 'Error sending message.',
        });
        console.error(err);
      }
    });

    // Custom event to return room activity or update on seen messages
    socket.on('room-activity-request', async (roomId, reqType, callback) => {
      const room = await Chat.findOne({ room: roomId });

      if (reqType === 'fetch') {
        callback({ roomActivity: room?.activity });
      }

      if (reqType === 'mark-seen' && room) {
        room.activity.status = 'seen';
        room.save();
        socket.to(roomId).emit('room-activity-updated', room?.activity);
      }
    });

    // When a user add a friend, check if that friend is currently online and then emit an event to update its friend list
    socket.on('add-friend', (data) => {
      let friendSocket;
      // Find the the added friends is online
      io.sockets.sockets.forEach((s) => {
        if (s.handshake.auth.userId === data) {
          friendSocket = s;
        }
      });
      // then emit event to that friend to update its friends asynchronously
      friendSocket?.emit('update-friends');
    });
  } else {
    socket.emit('error', {
      type: 'auth-error',
      message: 'Not Authorized, Login with valid credentials',
    });
    console.error('Not Authorized, Login with valid credentials');
  }

  // Emit all online users on a socket connection/disconnection
  io.emit('online-users-updated', getOnlineUsers());
  socket.on('disconnect', () => {
    io.emit('online-users-updated', getOnlineUsers());
  });
});

const getOnlineUsers = () => {
  let onlineUsers = [];

  io.sockets.sockets.forEach((socket) =>
    onlineUsers.push(socket.handshake.auth.userId)
  );

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
