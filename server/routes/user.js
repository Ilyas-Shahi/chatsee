import express from 'express';

import { verifyToken } from '../middleware/auth.js';
import { getUser, getFriends, addFriend } from '../controllers/user.js';

const router = express.Router();

// Get user details
router.get('/:id', verifyToken, getUser);
// Query friends of the user id
router.get('/:id/friends', verifyToken, getFriends);
// Add a friend for user
router.patch('/:id/friends/add', verifyToken, addFriend);

export default router;
