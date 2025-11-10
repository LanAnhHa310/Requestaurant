 // require mongoose for ease of DB operations.
const mongoose = require("mongoose");

// Connect to user database.
mongoose.connect("mongodb://localhost/requestaurant-db"); 

// Export the mongoose connection to other files.
module.exports = mongoose; 