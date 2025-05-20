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

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'https://ai-powered-job-match.netlify.app',
        'https://ai-powered-job-match-platform.vercel.app',
        'http://localhost:3000'
    ];

// middlewares
app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (like mobile apps, curl requests)
        if(!origin) return callback(null, true);
        
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// API documentation route
app.get("/", (req, res) => {
    res.json({
        status: "API is running",
        endpoints: {
            health: {
                path: "/health",
                method: "GET",
                description: "Health check endpoint"
            },
            auth: {
                base: "/api/auth",
                endpoints: {
                    login: { method: "POST", path: "/" }
                }
            },
            users: {
                base: "/api/users",
                endpoints: {
                    register: { method: "POST", path: "/" },
                    profile: { method: "GET", path: "/profile" },
                    updateProfile: { method: "POST", path: "/profile" }
                }
            },
            jobs: {
                base: "/api/jobs",
                endpoints: {
                    getAllJobs: { method: "GET", path: "/" },
                    createJob: { method: "POST", path: "/" },
                    updateJob: { method: "PUT", path: "/:id" },
                    deleteJob: { method: "DELETE", path: "/:id" }
                }
            }
        }
    });
});

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
