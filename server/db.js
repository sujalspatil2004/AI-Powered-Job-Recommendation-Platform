const mongoose = require("mongoose");

module.exports = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {
        // Log the database URI to ensure it's correctly loaded
        console.log('Database URI:', process.env.DB);

        // Use async/await for better error handling
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Could not connect to database!", error);
        throw error; // Re-throw the error if you want calling code to handle it
    }
};
