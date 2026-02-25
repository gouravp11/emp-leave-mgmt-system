import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        if (role && !["employee", "manager"].includes(role)) {
            return res
                .status(400)
                .json({ message: "Role must be either 'employee' or 'manager'." });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "A user with this email already exists." });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "employee",
            userStatus: "pending"
        });

        res.status(201).json({
            message:
                "Account created successfully. Please wait for admin approval before logging in.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userStatus: user.userStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (user.userStatus === "pending") {
            return res.status(403).json({
                message: "Your account is pending approval. Please wait for an admin to approve it."
            });
        }

        const token = signToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userStatus: user.userStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });
    res.json({ message: "Logged out successfully." });
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate("managerId", "name email");

        if (!user) return res.status(404).json({ message: "User not found." });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userStatus: user.userStatus,
                createdAt: user.createdAt,
                department: user.profile?.department || null,
                manager: user.managerId
                    ? { name: user.managerId.name, email: user.managerId.email }
                    : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};
