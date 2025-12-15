const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, // Ito yung Notes
    isCompleted: { type: Boolean, default: false },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    // NEW FIELD: CATEGORY
    category: {
        type: String,
        enum: ['Personal', 'Work', 'School', 'Shopping', 'Health'], // Pwede mong dagdagan
        default: 'Personal'
    },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);