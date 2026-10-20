import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { loadEnv } from '../config/env.js';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const env = loadEnv();
const router = Router();

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/signup', async (req, res) => {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const { name, email, password } = parse.data;
  const existing = await User.findOne({ email }).lean();
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ sub: user._id, email }, env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name, email } });
});

router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid credentials' });
  const { email, password } = parse.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user._id, email }, env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email } });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email').lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: req.user.id, ...user } });
});

export default router;


