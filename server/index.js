import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import createAdmin from "./src/utils/createAdmin.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import leaveRoutes from "./src/routes/leave.routes.js";
import reimbursementRoutes from "./src/routes/reimbursement.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);
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
