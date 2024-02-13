const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ChatSchema = new Schema({
  room: String,
});

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;
