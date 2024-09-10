const mongoose = require('mongoose');
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const instance = await mongoose.connect(`${process.env.URL}`)
        console.log(`MongoDB connected: ${instance.connection.host}`);
    } catch (error) {
        console.log("Couldn't connect to MongoDB", error);
        process.exit(1);
    }
}

connectDB();