const express = require("express");
const User = require("../db");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    const { firstName, lastName, password } = req.body;

    try {
        const user = await User.create({
            firstName,
            lastName,
            password
        });

        res.json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

// Signin
router.post("/signin", async (req, res) => {
    const { firstName, password } = req.body;

    try {
        const user = await User.findOne({
            firstName,
            password
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.json({
            message: "Signin successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error during signin",
            error: error.message
        });
    }
});

module.exports = router;