import express from 'express';
import { getUser, signupUser } from '../controllers/user.js';

const router = express.Router();

router.post('/signup', signupUser);
router.get('/:id', getUser);

export default router;
