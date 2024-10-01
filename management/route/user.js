const express = require('express');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validator/userValidator');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body);

    console.log("hheree1");
    if (error) return res.status(400).json({ error: error.details[0].message });
    console.log("hheree2");

    const { username, password, status } = req.body;

    try {
        const user = new User({ username, password, status });
        const respo= await user.save();

        res.status(201).json({ message: 'User registered successfully!', userId:respo._id, userStatus: respo.status, username: respo.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login Successfull', userId:user._id , userStatus: user.status, name: user.username});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



router.get('/getAll', async (req, res) => {
    try {
        const users = await User.find(); 
        const usernames = users.map((user) => ({
            username: user.username,
            id: user._id
        })); 
        res.status(200).json(usernames); 
    } catch (err) {
        res.status(400).json({ error: err.message }); 
    }
});


module.exports = router;
