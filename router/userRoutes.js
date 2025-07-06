const {Router} = require('express');
const {userModel} = require('../db');
const jwt = require('jsonwebtoken');    
const bcrypt = require('bcrypt'); 
const dotenv = require('dotenv');


const router = Router(); 

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

module.exports = router;