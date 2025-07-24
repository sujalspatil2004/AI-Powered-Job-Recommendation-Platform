const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Login route
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        res.status(200).send({
            data: token,
            isAdmin: user.isAdmin,
            message: "logged in successfully"
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset",
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Reset link sent to your email address" });
    } catch (error) {
        console.error("Forgot-password error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.body.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send({ message: "Token is invalid or expired" });
        }

        const { error } = validatePassword(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset-password error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Validation
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

const validatePassword = (data) => {
    const schema = Joi.object({
        token: Joi.string().required().label("Reset Token"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;
