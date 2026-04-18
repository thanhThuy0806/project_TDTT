require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.send('Backend Travel App with Firebase is running...');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const profileRoutes = require('./routes/profile');
app.use('/api/user/profile', profileRoutes);