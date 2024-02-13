const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  firstName: { type: String, required: true, min: 2, max: 30 },
  lastName: { type: String, required: true, min: 2, max: 30 },
  userName: { type: String, required: true, min: 5, max: 30, unique: true },
  email: { type: String, required: true, min: 5, max: 30, unique: true },
});

const User = mongoose.model('User', UserSchema);

export default User;
