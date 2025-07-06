const express = require('express');
const {Router} = require('express');
const {userModel} = require('../db');
const jwt = require('jsonwebtoken');    
const bcrypt = require('bcrypt'); 
const dotenv = require('dotenv');
const { userMiddleware } = require('../middleware/user');
const { config } = require("../configure");


const router = Router(); 
require('dotenv').config();



router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await userModel.create({
            email,
            password: hashedPassword
        });

        
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_USER_PASSWORD,
            { expiresIn: '1h' } 
        );

        res.json({ token });

    } catch (error) {
        console.log("Error in user registration", error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_USER_PASSWORD,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (error) {
        console.log("Error in user sign-in", error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/getUser', userMiddleware ,async (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({ message: error.message });
    }

})

module.exports = router;
