import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Enable CORS for all origins (good for development)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Simple test route to check CORS and server status
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS works!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Blog API routes
app.use('/api/blogs', blogRoutes);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});