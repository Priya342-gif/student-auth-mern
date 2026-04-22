import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// connect database
connectDB();

const app = express();

// middleware
app.use(express.json());

// ✅ CORS FIX (important for deployment)
app.use(
    cors({
        origin: "*",
    })
);

// routes
app.use("/api", authRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});