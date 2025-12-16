const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// 1. INITIALIZE APP (Dapat una ito!)
const app = express();

// 2. CONFIGURATION
// Use Render's PORT or default to 5000
const PORT = process.env.PORT || 5000; 

// 3. MIDDLEWARE (Dapat sunod sa Init)
app.use(cors()); 
app.use(express.json()); 

// 4. DATABASE CONNECTION
// Use Render's Environment Variable for DB, or Localhost if on PC
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// 5. ROUTES
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// 6. TEST ROUTE (Optional, para makita kung online)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 7. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});