const mongoose = require('mongoose');

// Ito ang blueprint ng Task natin sa database
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Dapat may laman ang title
    },
    description: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false // Not done by default
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);