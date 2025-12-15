const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// NOTE: Siguraduhin na tumatakbo ang MongoDB sa background kung local
const MONGODB_URI = 'mongodb://localhost:27017/taskmanager_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// --- IMPORT ROUTES ---
const taskRoutes = require('./routes/taskRoutes');

// Use Routes
// Lahat ng request sa /api/tasks ay pupunta sa taskRoutes
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});