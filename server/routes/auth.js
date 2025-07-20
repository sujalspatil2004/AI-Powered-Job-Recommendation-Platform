const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto");

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

        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');
        
        // Save token and expiration
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        res.status(200).send({ 
            message: "Password reset token generated successfully",
            resetToken: token 
        });
    } catch (error) {
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
            return res.status(400).send({ message: "Password reset token is invalid or has expired" });
        }

        // Validate new password
        const { error } = validatePassword(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

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
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
};

module.exports = router;
