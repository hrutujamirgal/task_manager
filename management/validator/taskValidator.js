const Joi = require('joi');

// Task creation validation 
const taskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().valid('To Do', 'In Progress', 'Completed').default('To Do'),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Low'),
    assignedUser: Joi.string().optional(), 
    assigningUser: Joi.string().optional(), 
});

module.exports = { taskSchema };
