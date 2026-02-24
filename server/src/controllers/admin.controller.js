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

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin accounts cannot be deleted." });
        }

        await user.deleteOne();

        res.json({ message: `User "${user.name}" has been deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const assignManager = async (req, res) => {
    try {
        const { userId } = req.params;
        const { managerId } = req.body;

        // --- validate target user ---
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "Admins cannot be assigned a manager." });
        }
        if (user.userStatus !== "approved") {
            return res
                .status(400)
                .json({ message: "User must be approved before assigning a manager." });
        }

        // Allow unassigning a manager
        if (!managerId) {
            user.managerId = null;
            await user.save();
            return res.json({ message: `Manager unassigned from "${user.name}" successfully.` });
        }

        // Prevent self-assignment
        if (managerId === userId) {
            return res.status(400).json({ message: "A user cannot be their own manager." });
        }

        // --- validate proposed manager ---
        const manager = await User.findById(managerId).select("-password");
        if (!manager) {
            return res.status(404).json({ message: "Proposed manager not found." });
        }
        if (manager.role !== "manager") {
            return res
                .status(400)
                .json({ message: "The assigned manager must have the 'manager' role." });
        }
        if (manager.userStatus !== "approved") {
            return res
                .status(400)
                .json({ message: "The proposed manager account is not yet approved." });
        }

        // Already assigned to the same manager
        if (user.managerId && user.managerId.equals(manager._id)) {
            return res
                .status(400)
                .json({ message: `"${user.name}" already reports to this manager.` });
        }

        // --- direct-reports cap (split by role) ---
        const MAX_EMPLOYEE_REPORTS = parseInt(process.env.MAX_EMPLOYEE_REPORTS) || 10;
        const MAX_MANAGER_REPORTS = parseInt(process.env.MAX_MANAGER_REPORTS) || 2;

        if (user.role === "employee") {
            const employeeCount = await User.countDocuments({
                managerId: manager._id,
                role: "employee"
            });
            if (employeeCount >= MAX_EMPLOYEE_REPORTS) {
                return res.status(400).json({
                    message: `This manager already has the maximum of ${MAX_EMPLOYEE_REPORTS} direct employee reports.`
                });
            }
        } else if (user.role === "manager") {
            const managerCount = await User.countDocuments({
                managerId: manager._id,
                role: "manager"
            });
            if (managerCount >= MAX_MANAGER_REPORTS) {
                return res.status(400).json({
                    message: `This manager already manages the maximum of ${MAX_MANAGER_REPORTS} other managers.`
                });
            }
        }

        // --- circular chain check ---
        // Walk up the proposed manager's ancestor chain.
        // If we encounter the target user, assigning this manager would create a cycle.
        let currentId = manager.managerId;
        const visited = new Set([manager._id.toString()]);
        while (currentId) {
            if (currentId.equals(user._id)) {
                return res.status(400).json({
                    message:
                        "Circular management chain detected: the proposed manager is already " +
                        "managed (directly or indirectly) by this user."
                });
            }
            const key = currentId.toString();
            if (visited.has(key)) break; // guard against existing bad data
            visited.add(key);
            const ancestor = await User.findById(currentId).select("managerId");
            if (!ancestor) break;
            currentId = ancestor.managerId;
        }

        // --- assign ---
        user.managerId = manager._id;
        await user.save();

        res.json({
            message: `"${user.name}" has been assigned to manager "${manager.name}" successfully.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                managerId: user.managerId
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const changeRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role || !["employee", "manager"].includes(role)) {
            return res
                .status(400)
                .json({ message: "Role must be either 'employee' or 'manager'." });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin role cannot be changed." });
        }

        if (user.role === role) {
            return res.status(400).json({ message: `User already has the role '${role}'.` });
        }

        user.role = role;
        if (user.managerId) {
            user.managerId = null;
        }
        await user.save();

        res.json({
            message: `User "${user.name}" role updated to '${role}'.`,
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
