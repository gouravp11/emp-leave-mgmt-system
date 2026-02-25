import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";

export const getAllLeaves = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const leaves = await Leave.find(filter)
            .populate("requesterId", "name email role")
            .sort({ createdAt: -1 });

        res.json({ leaves });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getMyLeaves = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = { requesterId: req.user._id };
        if (status) filter.status = status;

        const leaves = await Leave.find(filter).sort({ createdAt: -1 });
        res.json({ leaves });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getTeamLeaves = async (req, res) => {
    try {
        const { status } = req.query;

        // Get all direct reports of this manager
        const teamMembers = await User.find({ managerId: req.user._id }).select("_id");
        const teamIds = teamMembers.map((m) => m._id);

        const filter = { requesterId: { $in: teamIds } };
        if (status) filter.status = status;

        const leaves = await Leave.find(filter)
            .populate("requesterId", "name email role")
            .sort({ createdAt: -1 });

        res.json({ leaves });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getUserLeaves = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.query;

        // Ensure the target user is a direct report of this manager
        const targetUser = await User.findById(userId).select("managerId name email role");
        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!targetUser.managerId || !targetUser.managerId.equals(req.user._id)) {
            return res.status(403).json({ message: "This user is not in your team." });
        }

        const filter = { requesterId: userId };
        if (status) filter.status = status;

        const leaves = await Leave.find(filter).sort({ createdAt: -1 });

        res.json({
            user: {
                id: targetUser._id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role
            },
            leaves
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const cancelLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { note } = req.body || {};

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ message: "Leave application not found." });
        }

        if (leave.status !== "approved") {
            return res.status(400).json({
                message: `Only approved leaves can be cancelled. This leave is ${leave.status}.`
            });
        }

        leave.status = "cancelled";
        leave.cancelledAt = new Date();
        leave.approvalHistory.push({
            actionBy: req.user._id,
            action: "cancelled",
            note: note || null
        });

        await leave.save();

        res.json({ message: "Leave application cancelled successfully.", leave });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const deleteLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ message: "Leave application not found." });
        }

        if (!leave.requesterId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to delete this leave application." });
        }

        if (leave.status !== "pending") {
            return res.status(400).json({
                message: `Only pending leaves can be deleted. This leave is ${leave.status}.`
            });
        }

        await leave.deleteOne();

        res.json({ message: "Leave application deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const createLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        // Must have a manager assigned (Option A)
        if (!req.user.managerId) {
            return res.status(400).json({
                message: "You cannot apply for leave until a manager has been assigned to you."
            });
        }

        // Basic field validation
        if (!leaveType || !startDate || !endDate) {
            return res
                .status(400)
                .json({ message: "leaveType, startDate, and endDate are required." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        if (end < start) {
            return res.status(400).json({ message: "End date cannot be before start date." });
        }

        // Calculate inclusive calendar days
        const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const leave = new Leave({
            requesterId: req.user._id,
            leaveType,
            startDate: start,
            endDate: end,
            totalDays,
            reason
        });

        await leave.save();

        res.status(201).json({
            message: "Leave application submitted successfully.",
            leave
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const approveLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { note } = req.body || {};

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ message: "Leave application not found." });
        }

        // Ensure the requester actually reports to this manager
        const requester = await User.findById(leave.requesterId).select("managerId");
        if (!requester || !requester.managerId || !requester.managerId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to action this leave application." });
        }

        if (leave.status !== "pending") {
            return res.status(400).json({
                message: `Leave is already ${leave.status} and cannot be approved.`
            });
        }

        leave.status = "approved";
        leave.approverId = req.user._id;
        leave.approvedAt = new Date();
        leave.approvalHistory.push({
            actionBy: req.user._id,
            action: "approved",
            note: note || null
        });

        await leave.save();

        res.json({
            message: "Leave application approved successfully.",
            leave
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const rejectLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { rejectionReason, note } = req.body || {};

        if (!rejectionReason) {
            return res.status(400).json({ message: "rejectionReason is required." });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ message: "Leave application not found." });
        }

        // Ensure the requester actually reports to this manager
        const requester = await User.findById(leave.requesterId).select("managerId");
        if (!requester || !requester.managerId || !requester.managerId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to action this leave application." });
        }

        if (leave.status !== "pending") {
            return res.status(400).json({
                message: `Leave is already ${leave.status} and cannot be rejected.`
            });
        }

        leave.status = "rejected";
        leave.approverId = req.user._id;
        leave.rejectionReason = rejectionReason;
        leave.rejectedAt = new Date();
        leave.approvalHistory.push({
            actionBy: req.user._id,
            action: "rejected",
            note: note || null
        });

        await leave.save();

        res.json({
            message: "Leave application rejected.",
            leave
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};
