const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const admin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).send({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const user = await User.findById(decoded._id);
        
        if (!user || !user.isAdmin) {
            return res.status(403).send({ message: "Access denied. Admin rights required." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(401).send({ message: "Invalid token or insufficient privileges." });
    }
};

module.exports = admin;