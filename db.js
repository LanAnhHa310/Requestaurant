 // require mongoose for ease of DB operations.
const mongoose = require("mongoose");

// Connect to user database.
mongoose.connect("mongodb://localhost:27017/requestaurant-db"); 

mongoose.connection.on("connected", () => {
    console.log("Mongo connected DB:", mongoose.connection.name);
});

// Export the mongoose connection to other files.
module.exports = mongoose; 