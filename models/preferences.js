// References the database connection in the parent directory ( db.js )
const db = require("../db"); 

// Setup schema and create model:
const Preferences = db.model( "Preferences", {
  
  // Username is shared across from user database to assign users.
  userName: { type: String, required: true },

  // Actual preference list:
  price: { type: String },
  rating: { type: String },
  dietary: { type: String },
  atmosphere: { type: String },
});

// Export User model to other files:
module.exports = Preferences;