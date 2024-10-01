const express = require('express');
const Task = require('../model/Task');
const { taskSchema } = require('../validator/taskValidator');
const { Parser } = require('json2csv'); 

const router = express.Router();

// new task
router.post('/addTask', async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    

    const { title, description, dueDate, status, priority, assignedUser,assigningUser } = req.body;
    
    try {
        const task = new Task({ title, description, dueDate, status, priority, assignedUser,assigningUser });
        
        const respo = await task.save();
        const job = await Task.findOne({_id: respo._id}).populate('assignedUser', 'username')
        .populate('assigningUser', 'username');
        res.status(201).json({message:"Task added successfully", task:job});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//geet sngle task
router.get('/get/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const tasks = await Task.find({_id: id});
        res.json(tasks);
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
        const tasks = await Task.find({ assignedUser: req.params.id })
            .populate('assignedUser', 'username')
            .populate('assigningUser', 'username'); 
        
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//get admin tasks
router.get('/getTasks/:id', async (req, res) => {
    try {
        const tasks = await Task.find({assigningUser: req.params.id}).populate('assignedUser', 'username')
        .populate('assigningUser', 'username'); ;
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//proofile deetails
router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id; 
  try {
    const tasksAssignedByUser = await Task.find({ assignedUser: userId });
    const tasksAssignedToUser = await Task.find({ assigningUser: userId });

    const summary = {
      totalAssignedTasks: tasksAssignedToUser.length, 
      totalAssignedTasksByUser: tasksAssignedByUser.length,
      toDoTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      highPriorityTasks: 0,
      lowPriorityTasks: 0,
      mediumPriorityTasks: 0,
    };

    tasksAssignedByUser.forEach(task => {
      if (task.status === 'To Do') {
        summary.toDoTasks++;
      } else if (task.status === 'In Progress') {
        summary.inProgressTasks++;
      } else if (task.status === 'Completed') {
        summary.completedTasks++;
      }

      if (task.priority === 'High') {
        summary.highPriorityTasks++;
      } else if (task.priority === 'Low') {
        summary.lowPriorityTasks++;
      }else if (task.priority === 'Medium') {
        summary.mediumPriorityTasks++;
      }
    });

    res.status(200).json({
      message: 'Task summary retrieved successfully',
      summary,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      message: 'Error fetching tasks',
      error: error.message,
    });
  }
});




// Summary report endpoint
router.get('/summary', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'username');

    const userSummary = {};

    tasks.forEach(task => {
      const { assignedUser, status, priority } = task;

      if (assignedUser) {
        const userId = assignedUser._id.toString();
        const username = assignedUser.username;

        if (!userSummary[userId]) {
          userSummary[userId] = {
            username: username,
            totalAssignedTasks: 0,
            toDoTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
            highPriorityTasks: 0,
            lowPriorityTasks: 0,
            mediumPriorityTasks: 0,
          };
        }

        userSummary[userId].totalAssignedTasks++;
        if (status === 'To Do') {
          userSummary[userId].toDoTasks++;
        } else if (status === 'In Progress') {
          userSummary[userId].inProgressTasks++;
        } else if (status === 'Completed') {
          userSummary[userId].completedTasks++;
        }

        if (priority === 'High') {
          userSummary[userId].highPriorityTasks++;
        } else if (priority === 'Low') {
          userSummary[userId].lowPriorityTasks++;
        } else if (priority === 'Medium') {
          userSummary[userId].mediumPriorityTasks++;
        }
      }
    });

    const summaryArray = Object.keys(userSummary).map(userId => ({
      userId,
      username: userSummary[userId].username,
      totalAssignedTasks: userSummary[userId].totalAssignedTasks,
      toDoTasks: userSummary[userId].toDoTasks,
      inProgressTasks: userSummary[userId].inProgressTasks,
      completedTasks: userSummary[userId].completedTasks,
      highPriorityTasks: userSummary[userId].highPriorityTasks,
      lowPriorityTasks: userSummary[userId].lowPriorityTasks,
      mediumPriorityTasks: userSummary[userId].mediumPriorityTasks,
    }));

    res.status(200).json({
      message: 'Summary report retrieved successfully',
      summary: summaryArray,
    });

  } catch (error) {
    console.error('Error generating summary report:', error);
    res.status(500).json({
      message: 'Error generating summary report',
      error: error.message,
    });
  }
});

// CSV download endpoint
router.get('/report', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'username');

    const userSummary = {};

    tasks.forEach(task => {
      const { assignedUser, status, priority } = task;

      if (assignedUser) {
        const userId = assignedUser._id.toString();
        const username = assignedUser.username;

        if (!userSummary[userId]) {
          userSummary[userId] = {
            username: username,
            totalAssignedTasks: 0,
            toDoTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
            highPriorityTasks: 0,
            lowPriorityTasks: 0,
            mediumPriorityTasks: 0,
          };
        }

        userSummary[userId].totalAssignedTasks++;
        if (status === 'To Do') {
          userSummary[userId].toDoTasks++;
        } else if (status === 'In Progress') {
          userSummary[userId].inProgressTasks++;
        } else if (status === 'Completed') {
          userSummary[userId].completedTasks++;
        }

        if (priority === 'High') {
          userSummary[userId].highPriorityTasks++;
        } else if (priority === 'Low') {
          userSummary[userId].lowPriorityTasks++;
        } else if (priority === 'Medium') {
          userSummary[userId].mediumPriorityTasks++;
        }
      }
    });

    const summaryArray = Object.keys(userSummary).map(userId => ({
      username: userSummary[userId].username,
      totalAssignedTasks: userSummary[userId].totalAssignedTasks,
      toDoTasks: userSummary[userId].toDoTasks,
      inProgressTasks: userSummary[userId].inProgressTasks,
      completedTasks: userSummary[userId].completedTasks,
      highPriorityTasks: userSummary[userId].highPriorityTasks,
      lowPriorityTasks: userSummary[userId].lowPriorityTasks,
      mediumPriorityTasks: userSummary[userId].mediumPriorityTasks,
    }));

    const csvParser = new Parser();
    const csv = csvParser.parse(summaryArray);

    res.header('Content-Type', 'text/csv');
    res.attachment('tasks_report.csv'); 
    res.send(csv);

  } catch (error) {
    console.error('Error generating CSV report:', error);
    res.status(500).json({
      message: 'Error generating CSV report',
      error: error.message,
    });
  }
});


// Update a task
router.put('/update/:id', async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    console.log(error)
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body , { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        const job = await Task.findOne({_id: req.params.id,}).populate('assignedUser', 'username').populate('assigningUser', 'username');
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a task
router.delete('/delete/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
