const express = require("express");
const router = express.Router();
require("dotenv").config()
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./userAuth.js")

// signup routes
router.post('/signup', async (req, res) => {
    // code for signup logic goes here
    try {
        const { username, email, password, address } = req.body;

        if (username.length < 4) {
            return res.status(404).json({ message: "Username must be at least 4 characters" })
        }

        const existingUsername = await User.findOne({ username: username })
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists" })
        }

        const existingEmail = await User.findOne({ email: email })
        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists" })
        }

        if (password.length <= 5) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username, email: email, password: hashedPassword, address: address
        })
        await newUser.save();
        return res.status(200).json({ message: "Sign-Up successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

router.post('/login', async (req, res) => {
    // code for login logic goes here
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Please provide both username and password" });
        }

        const existingUser = await User.findOne({ username });
        // console.log(existingUser);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use bcrypt.compare asynchronously with await
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const token = jwt.sign(
                    {
                        id: existingUser._id,
                        username: existingUser.username,
                        role: existingUser.role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "36d" }
                )

                res.status(200).json({ message: "signin successful", id: existingUser._id, role:        existingUser.role, token: token })
            }
            else return res.status(400).json({ message: "given password is incorrect", err })
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/get-userdetails", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        // console.log("User details id: ", id);

        const user = await User.findById({ _id: id }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in get user all details: " + error.message);
        return res.status(404).json({ message: error.message });
    }
})

router.put("/update-address", authenticateToken, async(req, res)=>{
    try {
        const {id} = req.headers;
        const {address} = req.body;
        // console.log(address);
        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    address: address,
                }
            },
            {new: true}
        )
        // console.log(user);
        
        return res.status(200).json({message: "Address updated successfully"})
    } catch (error) {
        return res.status(404).json({message: "Error updating address"});
    }
})

module.exports = router;