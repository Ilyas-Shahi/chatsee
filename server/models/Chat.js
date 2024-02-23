import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    sender: {
      type: String,
      // required: true
    },
    receiver: {
      type: String,
      //  required: true
    },
    message: { type: String || Number, required: true },
  },
  { timestamps: true }
);
export const Message = mongoose.model('Message', MessageSchema);

const ChatSchema = new Schema(
  {
    room: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);
export const Chat = mongoose.model('Chat', ChatSchema);
