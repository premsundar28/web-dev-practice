const express = require('express');
const userRoutes = require('./router/userRoutes');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Parse JSON bodies

app.use('/api/v1/user',userRoutes);

async function main() {
     
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to the database");
    } catch(error) {
         console.log("Failed to connect to the database", error)
    }

    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
}



main();