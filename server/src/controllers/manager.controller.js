import User from "../models/user.model.js";

export const getMyTeam = async (req, res) => {
    try {
        const users = await User.find({ managerId: req.user._id }).select("-password");
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};
