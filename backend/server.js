const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());

const app = express();
// USE PROCESS.ENV.PORT (Required by Render)
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors()); // Allows all connections (Good for now)
app.use(express.json());

// DATABASE CONNECTION
// Kung nasa Render (production), gagamitin niya yung process.env.MONGO_URI
// Kung nasa PC mo (local), gagamitin niya yung localhost string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://<db_username>:<db_password>@taskmanager.u0amdu5.mongodb.net/?appName=taskmanager'

// --- IMPORT ROUTES ---
const taskRoutes = require('./routes/taskRoutes');

// Use Routes
// Lahat ng request sa /api/tasks ay pupunta sa taskRoutes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});