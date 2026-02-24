import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } }).select("-password");
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin accounts do not require approval." });
        }

        if (user.userStatus === "approved") {
            return res.status(400).json({ message: "User is already approved." });
        }

        user.userStatus = "approved";
        await user.save();

        res.json({
            message: `User "${user.name}" has been approved successfully.`,
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
