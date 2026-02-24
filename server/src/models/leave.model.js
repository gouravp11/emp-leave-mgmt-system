import mongoose from "mongoose";

const { Schema } = mongoose;

const leaveSchema = new Schema(
    {
        requesterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        approverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        leaveType: {
            type: String,
            enum: ["casual", "sick", "earned", "unpaid"],
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        totalDays: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "cancelled"],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            trim: true
        },

        approvedAt: {
            type: Date
        },

        rejectedAt: {
            type: Date
        },

        cancelledAt: {
            type: Date
        },

        // Future-proof: approval tracking
        approvalHistory: [
            {
                actionBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                },
                action: {
                    type: String,
                    enum: ["approved", "rejected", "cancelled"]
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

// Validate that endDate >= startDate
leaveSchema.pre("validate", function (next) {
    if (this.endDate < this.startDate) {
        return next(new Error("End date cannot be before start date"));
    }
    next();
});

// Indexes for performance
leaveSchema.index({ requesterId: 1 });
leaveSchema.index({ approverId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1 });

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
