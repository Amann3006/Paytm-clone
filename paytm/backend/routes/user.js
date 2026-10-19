
const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const { User, Account } = require("../db");

// Signup validation
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
    password: zod.string().min(6)
});

router.post("/signup", async (req, res) => {
    const result = signupBody.safeParse(req.body);

    if (!result.success) {
        return res.status(411).json({
            message: "Incorrect inputs: Email must be valid and password must be at least 6 characters",
            error: result.error
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(409).json({
            message: "Email already taken"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const userId = user._id;

    // Give an initial random balance rounded to 2 decimal places
    const initialBalance = Math.round((100 + Math.random() * 9900) * 100) / 100;
    await Account.create({
        userId,
        balance: initialBalance
    });

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token,
        user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
});

// Signin validation
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(1)
});

// Signin
router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect email or password format"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        return res.json({
            message: "Logged in successfully",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }

    res.status(411).json({
        message: "Invalid email or password"
    });
});

// Current user profile
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user info" });
    }
});

// Update validation
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

// Update user
router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne(
        {
            _id: req.userId
        },
        req.body
    );

    res.json({
        message: "Updated successfully"
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Bulk search
router.get("/bulk", async (req, res) => {
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            currentUserId = decoded.userId;
        } catch (e) {
            // Ignore invalid token in search
        }
    }

    const filter = req.query.filter ? escapeRegex(req.query.filter.trim()) : "";

    const queryConditions = {};
    if (currentUserId) {
        queryConditions._id = { $ne: currentUserId };
    }

    if (filter) {
        queryConditions.$or = [
            {
                firstName: {
                    "$regex": filter,
                    "$options": "i"
                }
            },
            {
                lastName: {
                    "$regex": filter,
                    "$options": "i"
                }
            }
        ];
    }

    const users = await User.find(queryConditions);

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;

