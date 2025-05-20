const mongoose = require("mongoose");

module.exports = () => {
    // Set strictQuery to true to suppress the warning
    mongoose.set('strictQuery', true);

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {
        mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database successfully");
    } catch (error) {
        console.log(error);
        console.log("Could not connect database!");
    }
};
