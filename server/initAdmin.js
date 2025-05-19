require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const connection = require("./db");

const adminUser = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@jobmatch.com",
    password: "Admin@123",
    isAdmin: true,
    location: "Remote",
    yearsOfExperience: 5,
    skills: ["Management", "Leadership"],
    preferredJobType: "any"
};

const createAdmin = async () => {
    try {
        // Connect to database
        await connection();
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(adminUser.password, salt);
        
        // Create admin user
        const admin = await new User({
            ...adminUser,
            password: hashPassword
        }).save();
        
        console.log("Admin user created successfully");
        console.log("Email:", adminUser.email);
        console.log("Password:", adminUser.password);
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdmin();