const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE (UPDATED)
router.post('/', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description, // <-- ADDED
            priority: req.body.priority,
            category: req.body.category,       // <-- ADDED
            dueDate: req.body.dueDate
        });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE (UPDATED)
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, // req.body now contains description & category
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;