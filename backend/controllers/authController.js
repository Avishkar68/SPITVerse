// controllers/auth.js (Final working version for combined Login/Register)

import { hash, compare } from 'bcryptjs';
import User from '../models/User.js';
import Post from "../models/Post.js"
const SALT_ROUNDS = 10;

export const login = async (req, res) => {
  try {
    const { email, password, name } = req.body; 

    // 1. Basic Validation: Email and password are always required
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const normalizedEmail = email.trim().toLowerCase();
    const allowedDomain = '@spit.ac.in';
    
    // 2. Domain Validation
    if (!normalizedEmail.endsWith(allowedDomain)) {
      return res.status(403).json({ message: `Only ${allowedDomain} emails are allowed` });
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // --- REGISTRATION BLOCK (New User) ---
      
      // 3. New User Validation: Name is required for sign-up
      if (!name || name.trim() === '') return res.status(400).json({ message: 'Name is required for new registration.' });
      
      const passwordHash = await hash(password, SALT_ROUNDS);
      
      user = new User({ 
          email: normalizedEmail, 
          passwordHash, 
          name: name.trim() 
      });
      await user.save();

      const obj = user.toObject();
      delete obj.passwordHash;
      
      // Fetch full app data for immediate feed access
      const allUsers = await User.find().select('-passwordHash');
      const allPosts = await Post.find();

      return res.status(201).json({ 
          message: 'User created and logged in', 
          user: obj,
          appData: { users: allUsers, posts: allPosts }
      });
      
    } else {
      // --- LOGIN BLOCK (Existing User) ---
      
      // 4. Existing User: Verify password
      const match = await compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      
      // Password match success!
      const obj = user.toObject();
      delete obj.passwordHash;

      // 5. Fetch full app data for feed access
      const allUsers = await User.find().select('-passwordHash');
      const allPosts = await Post.find();

      return res.json({
        message: 'Login successful',
        user: obj,
        appData: { users: allUsers, posts: allPosts }
      });
    }
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};