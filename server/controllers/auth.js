import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;

    res.cookie('access_token', token).status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const signup = async (req, res) => {
  try {
    const { password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { ...req.body, password: hashedPassword };
    const user = await User.create(userData);

    user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie('access_token', token).status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('access_token');

    res.status(200).json({ message: 'You have been logged out' });
  } catch (err) {
    res.status(501).json(err);
  }
};
