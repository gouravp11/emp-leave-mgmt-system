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
