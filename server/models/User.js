import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true, min: 2, max: 30 },
  lastName: { type: String, required: true, min: 2, max: 30 },
  userName: { type: String, required: true, min: 5, max: 30, unique: true },
  email: { type: String, required: true, min: 5, max: 30, unique: true },
  password: { type: String, required: true, min: 8 },
  friends: { type: Array, default: [] },
});

const User = mongoose.model('User', UserSchema);

export default User;
