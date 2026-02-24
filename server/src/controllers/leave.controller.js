import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";

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
