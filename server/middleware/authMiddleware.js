import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      token = header.slice(7).trim();
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized: token missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized: user not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized: invalid token' });
  }
}

export function optionalAuth(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      token = header.slice(7).trim();
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret');
      User.findById(decoded.id).select('-password').then((user) => {
        req.user = user || null;
        next();
      }).catch(() => next());
    } else {
      req.user = null;
      next();
    }
  } catch {
    req.user = null;
    next();
  }
}

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'change-this-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
