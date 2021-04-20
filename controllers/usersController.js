import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      res.status(200).json({
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid password or email');
    }
  } else {
    res.status(404);
    throw new Error('User not Found');
  }
});

// GET /api/users // admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error('Users not found');
  }
});

// GET /api/users/:userId  // admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not Found');
  }
});

// DELETE /api/users/:userId // admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    await user.remove();
    res.status(200).json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// PATCH /api/users/:userId // admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    const newUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.status(200).json(newUser);
  } else {
    res.status(404);
    throw new Error('User not Foint');
  }
});

// GET /api/users/profle // private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

// PATCH /api/users/profile // private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const newUser = await user.save();
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});
