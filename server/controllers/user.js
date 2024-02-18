import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};

export const getFriends = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, userName }) => {
        return {
          _id,
          firstName,
          lastName,
          userName,
        };
      }
    );

    res.status(200).json(formattedFriends);
    next();
  } catch (err) {
    res.status(404).json(err);
  }
};

export const addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: 'Not Allowed to change/add others friends.' });
    }

    const id = req.params.id;
    const friendsUsername = req.body.friendUsername;

    const user = await User.findById(id);

    if (friendsUsername === user.userName) {
      return res
        .status(405)
        .json({ message: 'Can not add yourself as a friend' });
    }

    const friend = await User.findOne({ userName: friendsUsername });

    if (!friend) {
      return res.status(404).json({ message: 'This user does not exist' });
    }

    let friendExists = false;
    user.friends.forEach((friendId) => {
      friendExists = friendId.toString() === friend._id.toString();
    });

    if (friendExists) {
      res.status(409).json({ message: 'Friend already added' });
    } else {
      user.friends = [...user.friends, friend._id];
      friend.friends = [...friend.friends, user._id];

      await user.save();
      await friend.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(501).json(err);
  }
};
