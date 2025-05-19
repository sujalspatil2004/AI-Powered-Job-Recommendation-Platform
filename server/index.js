require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// health check endpoint for Railway
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
