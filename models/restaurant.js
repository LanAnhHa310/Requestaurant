// References the database connection in the parent directory
const db = require("../db");

// Define Restaurant schema to store all restaurant data
const Restaurant = db.model("Restaurant", {
    name: { type: String, required: true, unique: true }, // Unique ensures no duplicate restaurants
    image: { type: String, default: "https://placehold.co/300x300?text=Restaurant" },
    rating: { type: String, required: true }, // e.g., "4.8★"
    price: { type: String, required: true }, // e.g., "$", "$$", "$$$"
    atmosphere: { type: String, required: true }, // e.g., "casual", "romantic"
    info: { type: String, required: true }, // Description of the restaurant
    diet: { type: String, required: true }, // dietary needs
    // Automatically timestamp when restaurant was added
    createdAt: { type: Date, default: Date.now }
});

module.exports = Restaurant;