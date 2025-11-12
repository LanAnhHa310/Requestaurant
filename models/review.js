const db = require("../db");

const Review = db.model("Review", {
    rating: {type: Int, required: true }, 
    text: {type: String }
});

module.exports = Review;