import User from "../models/user.model.js";

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
