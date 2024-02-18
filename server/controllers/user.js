import User from '../models/User.js';

export const signupUser = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.create(req.body);
    user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};
