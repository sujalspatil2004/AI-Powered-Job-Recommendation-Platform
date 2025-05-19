const router = require("express").Router();
const { Job } = require("../models/job");
const auth = require("../middleware/auth");
const { generateJobMatches } = require("../services/openai");
const { User } = require("../models/user");
const admin = require("../middleware/admin");

// Get all jobs
router.get("/", auth, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).send(jobs);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get AI-powered job recommendations for the current user
router.get("/recommendations/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.skills || user.skills.length === 0) {
            return res.status(400).json({ 
                message: "Please update your profile with skills to get personalized recommendations" 
            });
        }

        const jobs = await Job.find({});
        // Debug logging for AI input
        console.log("AI Recommendation Request for user:", user._id, user.skills);
        const recommendations = await generateJobMatches(user, jobs);
        // Debug logging for AI output
        console.log("AI Recommendations generated:", recommendations.length);
        res.status(200).json(recommendations);
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ message: "Error generating job recommendations", error: error.message });
    }
});

// Create new job (admin only)
router.post("/", [auth, admin], async (req, res) => {
    try {
        const job = await new Job(req.body).save();
        res.status(201).send(job);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Update job (admin only)
router.put("/:id", [auth, admin], async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!job) {
            return res.status(404).send({ message: "Job not found" });
        }
        res.status(200).send(job);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Delete job (admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).send({ message: "Job not found" });
        }
        res.status(200).send({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;