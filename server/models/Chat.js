const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const MessageSchema = new Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
export const Message = mongoose.model('Chat', MessageSchema);

const ChatSchema = new Schema(
  {
    room: { type: String, required: true },
    messages: [Message],
  },
  { timestamps: true }
);
export const Chat = mongoose.model('Chat', ChatSchema);
