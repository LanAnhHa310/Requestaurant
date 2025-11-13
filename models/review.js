// References the database connection in the parent directory
const db = require("../db");

// Define Review schema with proper Mongoose types
const Review = db.model("Review", {
    rating: {type: Number, required: true, min: 1, max: 5 }, 
    text: {type: String, required: true},

    // Link review to a restaurant by storing restaurant name or ID
    restaurantName: {type: String, required: true },

    // Track which user left the review
    userName: {type: String },

    // Automatically timestamp when review was created
    createdAt: {type: Date, default: Date.now }
});

module.exports = Review;