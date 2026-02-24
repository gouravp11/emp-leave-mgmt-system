import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import createAdmin from "./utils/createAdmin.js";

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

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
