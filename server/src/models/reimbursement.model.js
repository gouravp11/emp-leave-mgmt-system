import mongoose from "mongoose";

const { Schema } = mongoose;

const reimbursementSchema = new Schema(
    {
        requesterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        approverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        category: {
            type: String,
            enum: ["travel", "food", "medical", "fuel", "other"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            trim: true
        },

        receipts: [
            {
                url: {
                    type: String,
                    required: true
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paid"],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            trim: true
        },

        approvedAt: {
            type: Date
        },

        paidAt: {
            type: Date
        },

        approvalHistory: [
            {
                actionBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                },
                action: {
                    type: String,
                    enum: ["approved", "rejected", "paid"]
                },
                note: String,
                actionAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Indexes for performance
reimbursementSchema.index({ requesterId: 1 });
reimbursementSchema.index({ approverId: 1, status: 1 });
reimbursementSchema.index({ createdAt: -1 });

const Reimbursement = mongoose.model("Reimbursement", reimbursementSchema);

export default Reimbursement;
