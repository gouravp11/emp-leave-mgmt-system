import Reimbursement from "../models/reimbursement.model.js";
import User from "../models/user.model.js";

export const getAllReimbursements = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const reimbursements = await Reimbursement.find(filter)
            .populate("requesterId", "name email role")
            .sort({ createdAt: -1 });

        res.json({ reimbursements });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getMyReimbursements = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = { requesterId: req.user._id };
        if (status) filter.status = status;

        const reimbursements = await Reimbursement.find(filter).sort({ createdAt: -1 });
        res.json({ reimbursements });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getTeamReimbursements = async (req, res) => {
    try {
        const { status } = req.query;

        const teamMembers = await User.find({ managerId: req.user._id }).select("_id");
        const teamIds = teamMembers.map((m) => m._id);

        const filter = { requesterId: { $in: teamIds } };
        if (status) filter.status = status;

        const reimbursements = await Reimbursement.find(filter)
            .populate("requesterId", "name email role")
            .sort({ createdAt: -1 });

        res.json({ reimbursements });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getUserReimbursements = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.query;

        const targetUser = await User.findById(userId).select("managerId name email role");
        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!targetUser.managerId || !targetUser.managerId.equals(req.user._id)) {
            return res.status(403).json({ message: "This user is not in your team." });
        }

        const filter = { requesterId: userId };
        if (status) filter.status = status;

        const reimbursements = await Reimbursement.find(filter).sort({ createdAt: -1 });

        res.json({
            user: {
                id: targetUser._id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role
            },
            reimbursements
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const createReimbursement = async (req, res) => {
    try {
        const { category, amount, description } = req.body;

        // Must have a manager assigned
        if (!req.user.managerId) {
            return res.status(400).json({
                message:
                    "You cannot submit a reimbursement until a manager has been assigned to you."
            });
        }

        if (!category || !amount) {
            return res.status(400).json({ message: "category and amount are required." });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "amount must be a positive number." });
        }

        // Build receipts array from uploaded files
        const receipts = (req.files || []).map((file) => ({ url: file.path }));

        const reimbursement = new Reimbursement({
            requesterId: req.user._id,
            category,
            amount: parsedAmount,
            description,
            receipts
        });

        await reimbursement.save();

        res.status(201).json({
            message: "Reimbursement request submitted successfully.",
            reimbursement
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const uploadReceipts = async (req, res) => {
    try {
        const { reimbursementId } = req.params;

        const reimbursement = await Reimbursement.findById(reimbursementId);
        if (!reimbursement) {
            return res.status(404).json({ message: "Reimbursement not found." });
        }

        // Only the owner can add receipts
        if (!reimbursement.requesterId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to modify this reimbursement." });
        }

        if (reimbursement.status !== "pending") {
            return res.status(400).json({
                message: `Receipts cannot be added to a reimbursement that is already ${reimbursement.status}.`
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const newReceipts = req.files.map((file) => ({ url: file.path }));
        reimbursement.receipts.push(...newReceipts);
        await reimbursement.save();

        res.json({
            message: `${newReceipts.length} receipt(s) added successfully.`,
            receipts: reimbursement.receipts
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const approveReimbursement = async (req, res) => {
    try {
        const { reimbursementId } = req.params;
        const { note } = req.body || {};

        const reimbursement = await Reimbursement.findById(reimbursementId);
        if (!reimbursement) {
            return res.status(404).json({ message: "Reimbursement not found." });
        }

        const requester = await User.findById(reimbursement.requesterId).select("managerId");
        if (!requester || !requester.managerId || !requester.managerId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to action this reimbursement." });
        }

        if (reimbursement.status !== "pending") {
            return res.status(400).json({
                message: `Reimbursement is already ${reimbursement.status} and cannot be approved.`
            });
        }

        reimbursement.status = "approved";
        reimbursement.approverId = req.user._id;
        reimbursement.approvedAt = new Date();
        reimbursement.approvalHistory.push({
            actionBy: req.user._id,
            action: "approved",
            note: note || null
        });

        await reimbursement.save();
        res.json({ message: "Reimbursement approved successfully.", reimbursement });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const rejectReimbursement = async (req, res) => {
    try {
        const { reimbursementId } = req.params;
        const { rejectionReason, note } = req.body || {};

        if (!rejectionReason) {
            return res.status(400).json({ message: "rejectionReason is required." });
        }

        const reimbursement = await Reimbursement.findById(reimbursementId);
        if (!reimbursement) {
            return res.status(404).json({ message: "Reimbursement not found." });
        }

        const requester = await User.findById(reimbursement.requesterId).select("managerId");
        if (!requester || !requester.managerId || !requester.managerId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to action this reimbursement." });
        }

        if (reimbursement.status !== "pending") {
            return res.status(400).json({
                message: `Reimbursement is already ${reimbursement.status} and cannot be rejected.`
            });
        }

        reimbursement.status = "rejected";
        reimbursement.approverId = req.user._id;
        reimbursement.rejectionReason = rejectionReason;
        reimbursement.approvalHistory.push({
            actionBy: req.user._id,
            action: "rejected",
            note: note || null
        });

        await reimbursement.save();
        res.json({ message: "Reimbursement rejected.", reimbursement });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const markReimbursementPaid = async (req, res) => {
    try {
        const { reimbursementId } = req.params;
        const { note } = req.body || {};

        const reimbursement = await Reimbursement.findById(reimbursementId);
        if (!reimbursement) {
            return res.status(404).json({ message: "Reimbursement not found." });
        }

        if (reimbursement.status !== "approved") {
            return res.status(400).json({
                message: `Only approved reimbursements can be marked as paid. This is ${reimbursement.status}.`
            });
        }

        reimbursement.status = "paid";
        reimbursement.paidAt = new Date();
        reimbursement.approvalHistory.push({
            actionBy: req.user._id,
            action: "paid",
            note: note || null
        });

        await reimbursement.save();
        res.json({ message: "Reimbursement marked as paid.", reimbursement });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const getReceipt = async (req, res) => {
    try {
        const { reimbursementId, receiptIndex } = req.params;

        const reimbursement = await Reimbursement.findById(reimbursementId);
        if (!reimbursement) {
            return res.status(404).json({ message: "Reimbursement not found." });
        }

        // Access control: owner, their manager, or admin
        const isOwner = reimbursement.requesterId.equals(req.user._id);
        const isAdmin = req.user.role === "admin";
        let isManager = false;
        if (req.user.role === "manager") {
            const requester = await User.findById(reimbursement.requesterId).select("managerId");
            isManager = !!requester?.managerId?.equals(req.user._id);
        }

        if (!isOwner && !isAdmin && !isManager) {
            return res
                .status(403)
                .json({ message: "You are not authorised to view this receipt." });
        }

        const idx = parseInt(receiptIndex, 10);
        if (isNaN(idx) || idx < 0 || idx >= reimbursement.receipts.length) {
            return res.status(404).json({ message: "Receipt not found." });
        }

        const { url } = reimbursement.receipts[idx];
        return res.redirect(url);
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export const deleteReimbursement = async (req, res) => {
    try {
        const { reimbursementId } = req.params;

        const reimbursement = await Reimbursement.findById(reimbursementId);
        if (!reimbursement) {
            return res.status(404).json({ message: "Reimbursement not found." });
        }

        if (!reimbursement.requesterId.equals(req.user._id)) {
            return res
                .status(403)
                .json({ message: "You are not authorised to delete this reimbursement." });
        }

        if (reimbursement.status !== "pending") {
            return res.status(400).json({
                message: `Only pending reimbursements can be deleted. This is ${reimbursement.status}.`
            });
        }

        await reimbursement.deleteOne();
        res.json({ message: "Reimbursement deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};
