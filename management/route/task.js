const express = require('express');
const Task = require('../model/Task');
const { taskSchema } = require('../validator/taskValidator');

const router = express.Router();

// new task
router.post('/addTask', async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { title, description, dueDate, status, priority, assignedUser,assigningUser } = req.body;
    try {
        const task = new Task({ title, description, dueDate, status, priority, assignedUser,assigningUser });
        await task.save();
        res.status(201).json({message:"Task added successfully"});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedUser', 'username');
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { title, description, dueDate, status, priority, assignedUser,assigningUser } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate, status, priority, assignedUser,assigningUser }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
