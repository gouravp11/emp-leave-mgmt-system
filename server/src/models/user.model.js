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

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
