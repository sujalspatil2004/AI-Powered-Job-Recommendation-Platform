const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Register new user
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Update user profile
router.post("/profile", auth, async (req, res) => {
    try {
        const updates = {
            location: req.body.location,
            yearsOfExperience: req.body.yearsOfExperience,
            skills: req.body.skills,
            preferredJobType: req.body.preferredJobType,
        };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select("-password");

        res
            .status(200)
            .send({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Make user an admin (admin only)
router.post("/make-admin/:userId", [auth, admin], async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { isAdmin: true },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User promoted to admin successfully", user });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Admin: Get all users
router.get("/", [auth, admin], async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Admin: Get specific user
router.get("/:id", [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Admin: Update user
router.put("/:id", [auth, admin], async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        
        if (password) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Admin: Delete user
router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
