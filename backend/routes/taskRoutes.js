const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. GET ALL TASKS (Read)
// URL: http://localhost:5000/api/tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Get all, newest first
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. CREATE NEW TASK (Create)
// URL: http://localhost:5000/api/tasks
router.post('/', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description
        });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE TASK (Update - Mark as Done or Edit)
// URL: http://localhost:5000/api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Return the updated version
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE TASK (Delete)
// URL: http://localhost:5000/api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;