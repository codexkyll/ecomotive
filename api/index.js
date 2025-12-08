import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// --- MongoDB Connection (Cached for Serverless) ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // Don't exit process in serverless, just throw
    throw err;
  }
};

// Ensure DB connects before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- SCHEMAS ---
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
// Check if model exists before compiling to prevent OverwriteModelError in serverless hot reloads
const User = mongoose.models.User || mongoose.model('User', userSchema);

const detectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  imageName: String,     
  class: String,         
  confidence: Number,    
  accuracy: Number,
  precision: Number,
});
const Detection = mongoose.models.Detection || mongoose.model('Detection', detectionSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. Please login.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Root route to check if API is alive
app.get('/api', (req, res) => {
  res.send("API is running...");
});

// 1. SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created', token, user: { fullName, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, user: { fullName: user.fullName, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. SAVE LOG
app.post('/api/detections', authenticateToken, async (req, res) => {
  try {
    const { className, confidence } = req.body;
    const dateStr = new Date().toISOString().split('T')[0];
    const newDetection = new Detection({
      userId: req.user.id,
      imageName: `Detect_${dateStr}_${Math.floor(Math.random() * 1000)}.jpg`,
      class: className,
      confidence: parseFloat(confidence),
      accuracy: parseFloat(confidence), 
      precision: (parseFloat(confidence) + (Math.random() * 2)).toFixed(1)
    });
    await newDetection.save();
    res.status(201).json({ message: 'Log saved', data: newDetection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET HISTORY
app.get('/api/detections', authenticateToken, async (req, res) => {
  try {
    const logs = await Detection.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET ME
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Only listen if running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;