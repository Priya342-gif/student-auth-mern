import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 REGISTER
router.post("/register", async (req, res) => {
    const { name, email, password, course } = req.body;

    try {
        // check existing user
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        await Student.create({
            name,
            email,
            password: hashedPassword,
            course,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Student.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔥 check JWT secret exists
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret not set" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 UPDATE PASSWORD
router.put("/update-password", protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await Student.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong old password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated" });
    } catch (error) {
        console.error("Update Password Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 UPDATE COURSE
router.put("/update-course", protect, async (req, res) => {
    const { course } = req.body;

    try {
        const user = await Student.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.course = course;
        await user.save();

        res.json({ message: "Course updated" });
    } catch (error) {
        console.error("Update Course Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 GET DASHBOARD DATA
router.get("/dashboard", protect, async (req, res) => {
    try {
        const user = await Student.findById(req.user).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Dashboard Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;