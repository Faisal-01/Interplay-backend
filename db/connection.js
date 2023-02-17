const mongoose = require("mongoose");

const connectDB = (connection) => {
    mongoose.connect(connection, () => {
        console.log("connected to database");
    });
}

module.exports = connectDB