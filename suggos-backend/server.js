import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/suggos';

/* Middleware */
app.use(cors());
app.use(express.json());

/* Database Connection */
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('✗ MongoDB error:', err));

/* Routes */
app.use('/api/auth', authRoutes);

/* Health Check */
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

/* Error Handler */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
