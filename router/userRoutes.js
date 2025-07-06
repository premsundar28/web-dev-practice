const {Router} = require('express');
const {userModel} = require('../db');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

const router = Router(); 

router.post('/register', async (req, res) => {

    const {email, password} = req.body;

    await userModel.create({
        email: email,
        password : password
    })  
   
    res.json({
        success: true,
        message: 'User registered successfully',
        
    })
})

module.exports = router;