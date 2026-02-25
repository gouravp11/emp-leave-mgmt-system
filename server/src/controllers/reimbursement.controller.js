import Reimbursement from "../models/reimbursement.model.js";

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
