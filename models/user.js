// References the database connection in the parent directory ( db.js )
const db = require("../db"); 

// Setup schema and create model:
const User = db.model( "User", {
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  // Store user preferences in a nested document:
  preferences: { 
    cost: { type: Number },
    rating: { type: Number, min: 1, max: 5, Default: 3 },
  },
});

// Export User model to other files:
module.exports = User;