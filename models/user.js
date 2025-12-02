// References the database connection in the parent directory ( db.js )
const db = require("../db"); 

// Setup schema and create model:
const User = db.model( "User", {
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  bookmarks: [
    {
      name: String,
      image: String,
      price: String,
      rating: String,
      atmosphere: String,
      info: String
    }
  ]
});

// Export User model to other files:
module.exports = User;