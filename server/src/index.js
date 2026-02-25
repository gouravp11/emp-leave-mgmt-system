import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import createAdmin from "./utils/createAdmin.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import reimbursementRoutes from "./routes/reimbursement.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/reimbursements", reimbursementRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const { created } = await createAdmin({
        name: "admin",
        email: "admin@email.com",
        password: "admin1"
    });
    if (created) {
        console.log("Default admin created (admin@email.com)");
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
