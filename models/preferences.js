// References the database connection in the parent directory ( db.js )
const db = require("../db"); 

// Setup schema and create model:
const Preferences = db.model( "Preferences", {
  
  // Username is shared across from user database to assign users.
  userName: { type: String, required: true },

  // Actual preference list:
  price: { type: String },
  rating: { type: Number, min: 0, max: 5, Default: 0 },
  //dietary: { type: String },
  dietary: [String],
  atmosphere: { type: String },
});

// Export User model to other files:
module.exports = Preferences;