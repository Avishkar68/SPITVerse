import { hash, compare } from 'bcryptjs';
import User from '../models/User.js';

const SALT_ROUNDS = 10;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    // validate college email
    const allowedDomain = '@spit.ac.in';
    if (!email.endsWith(allowedDomain)) {
      return res.status(403).json({ message: `Only ${allowedDomain} emails are allowed` });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // create user
      const passwordHash = await hash(password, SALT_ROUNDS);
      user = new User({ email, passwordHash });
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
      return res.json({ message: 'Login successful', user: obj });
    }
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

