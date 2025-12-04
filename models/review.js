// References the database connection in the parent directory
const db = require("../db");

// Define Review schema with proper Mongoose types
const Review = db.model("Review", {
    // Rating from 1-5 stars
    rating: {type: Number, required: true, min: 1, max: 5 }, 
    text: {type: String, required: true},

    // Link review to a restaurant by storing restaurant name or ID
    restaurantName: {type: String, required: true },

    // Track which user left the review
    userName: {type: String },

    // Store restaurant details for display on profile page
    restaurantImage: { type: String },
    restaurantPrice: { type: String },
    restaurantAtmosphere: { type: String },
    restaurantRating: { type: String },
    restaurantInfo: { type: String },

    // Automatically timestamp when review was created/updated
    createdAt: {type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// One review per (userName, restaurantName)
Review.schema.index({ userName: 1, restaurantName: 1 }, { unique: true });

module.exports = Review;