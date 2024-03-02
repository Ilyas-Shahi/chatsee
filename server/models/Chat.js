import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  message: { type: String || Number, required: true },
  attachment: { type: String, default: null },
  sentAt: { type: Date, required: true },
});

const ChatSchema = new Schema(
  {
    room: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);
export const Chat = mongoose.model('Chat', ChatSchema);
