import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
