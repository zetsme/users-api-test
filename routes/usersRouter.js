import express from 'express';
//
import { auth, admin } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/usersController.js';

const router = express.Router();
// /api/users
router.route('/profile').get(auth, getUserProfile).patch(auth, updateUserProfile);
//
router.get('/', auth, admin, getUsers);
router.get('/:userId', auth, admin, getUser);
router.patch('/:userId', auth, admin, updateUser);
router.delete('/:userId', auth, admin, deleteUser);
//
router.post('/register', registerUser);
router.post('/login', loginUser);
//
export default router;
