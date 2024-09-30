const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assigningDate:{type:Date, default: Date.now()},
    dueDate: { type: Date },
    status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigningUser:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
});

module.exports = mongoose.model('Task', TaskSchema);
