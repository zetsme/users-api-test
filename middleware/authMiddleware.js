import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

export const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'JWT_SECRET');
      console.log(decodedToken);
      req.user = await User.findById(decodedToken.id).select('-password');
      console.log(req.user);
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Invalid Token, authorization failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization failed');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not ADMIN!!!!');
  }
};
