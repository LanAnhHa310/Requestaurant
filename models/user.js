// References the database connection in the parent directory ( db.js )
const db = require("../db"); 

// Setup schema and create model:
const User = db.model( "User", {
  userName: { type: String, required: true },
});

// Export User model to other files:
module.exports = User;