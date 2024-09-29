const Joi = require('joi');

// Registration validation 
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    status: Joi.string(),
});

// Login validation
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
