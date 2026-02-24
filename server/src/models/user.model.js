import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["employee", "manager", "admin"],
            default: "employee"
        },

        userStatus: {
            type: String,
            enum: ["pending", "approved"],
            default: "pending"
        },

        managerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        },

        profile: {
            joiningDate: {
                type: Date
            },
            department: {
                type: String
            },
            approvalLimit: {
                type: Number
            }
        }
    },
    {
        timestamps: true
    }
);

// Auto-approve admin accounts
userSchema.pre("save", async function () {
    if (this.role === "admin") {
        this.userStatus = "approved";
    }
});

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
