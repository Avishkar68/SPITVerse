import { hash, compare } from 'bcryptjs';
import User from '../models/User.js';
import Post from "../models/Post.js"
const SALT_ROUNDS = 10;

export const login = async (req, res) => {
  try {
    const { email, password , name } = req.body;

    if (!email || !password || !name) return res.status(400).json({ message: 'Name, Email and password required' });

    // normalize email
    const normalizedEmail = email.trim().toLowerCase();

    const allowedDomain = '@spit.ac.in';
    if (!normalizedEmail.endsWith(allowedDomain)) {
      return res.status(403).json({ message: `Only ${allowedDomain} emails are allowed` });
    }

    let user = await User.findOne({ email: normalizedEmail });


    if (!user) {
      // create user
      const passwordHash = await hash(password, SALT_ROUNDS);
      user = new User({ email, passwordHash ,name});
      await user.save();

      const obj = user.toObject();
      delete obj.passwordHash;
      return res.status(201).json({ message: 'User created', user: obj });
    } else {
      // verify password
      const match = await compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const obj = user.toObject();
      delete obj.passwordHash;


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

