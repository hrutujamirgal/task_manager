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
router.get('/getTask', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedUser', 'username');
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//get non admiin tasks
router.get('/getMyTasks/:id', async (req, res) => {
    try {
        const tasks = await Task.find({assignedUser: req.params.id});
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//get admiin tasks
router.get('/getTasks/:id', async (req, res) => {
    try {
        const tasks = await Task.find({assigningUser: req.params.id});
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



//summry report
router.get('/summary', async (req, res) => {
    try {
        const { status, assignedUser, assigningUser, startDate, endDate, format } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (assignedUser) {
            query.assignedUser = assignedUser;
        }

        if (assigningUser) {
            query.assigningUser = assigningUser;
        }

        if (startDate || endDate) {
            query.dueDate = {};
            if (startDate) {
                query.dueDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.dueDate.$lte = new Date(endDate);
            }
        }

        const tasks = await Task.find(query).populate('assignedUser assigningUser');

        if (!tasks.length) {
            return res.status(404).json({ message: 'No tasks found for the given filters' });
        }

        if (format === 'csv') {
            const csv = json2csv(tasks.map(task => ({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                assignedUser: task.assignedUser ? task.assignedUser.name : 'N/A',
                assigningUser: task.assigningUser ? task.assigningUser.name : 'N/A',
                dueDate: task.dueDate,
                assigningDate: task.assigningDate
            })));
            
            res.header('Content-Type', 'text/csv');
            res.attachment('task_summary.csv');
            return res.send(csv);
        } else {
            return res.json(tasks);
        }
    } catch (error) {
        console.error('Error generating task summary report:', error);
        return res.status(500).json({ message: 'Internal server error' });
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
