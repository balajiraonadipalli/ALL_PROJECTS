import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("Registering user:", username);
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ token: generateToken(user._id), username: user.username, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid Username or Password' });
    }
    res.json({ token: generateToken(user._id), username: user.username, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};