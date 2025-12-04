// generate express application object.
const express = require("express");

// provides utilities for working with file and directory paths.
var path = require('path');

// Ensure data is simewhat sanitized:
var sanitize = require('mongo-sanitize');

// Use user model exported from models directory ( connects to the db ).
const User = require("./models/user");
const Review = require("./models/review");
const Restaurant = require("./models/restaurant");
const Preferences = require("./models/preferences");

// ====================== SERVER SETUP ============================

// Set application object equal to express obj.
const app = express();

// Parse JSON and form bodies
app.use(express.json());

// Used to tell the webserver to recognize incoming POST or PUT request data as string / array values.
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname + '/public') ) );
// app.use(express.static('public'));

// ========================= METHODS ==============================

/*
  /search method: Tells the webserver to open the homepage,
  which displays the search menu for restaurants.
*/
app.get("/", (req, res) => {
  console.log("Opening search homepage...");

  // Open search menu homepage ( homepage.html )

  // res.sendFile(__dirname + '/homepage.html');
  res.sendFile('homepage.html', {root: __dirname + '/public'}); // Olive: Most likely a one-off pathing issue.
  // res.sendFile("homepage.html");
});


/*
  /register method: Validates inputs for username, password, and email,
  then adds a new user to the user data collection
  in the database from the register webpage request.
*/
app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: path.join(__dirname, "public") });
});

app.post("/register", async (req,res) => {
  try {
    // Sanitize body before use:
    const cleanData = sanitize(req.body);
    const { username, password, email } = cleanData;

    //Check clean data types:
    if ( (typeof username !== "string") || (typeof password !== "string") || (typeof email !== "string") ) {
      console.warn("Non-string registration data rejected", username);
      return res.status(400).json({ error: "Non-string registration data rejected" });
    }

    // Create new user DB entry from register webpage data:
    const newUser = new User({
      //userName: req.body.username,
      username: username,
      //password: req.body.password, // Needs to be hashed / secured later if possible!
      password: password,
      //email: req.body.email,
      email: email,
    });
    
    // Generate empty preferences list for user:
    const userPreferences = new Preferences({
      //userName: req.body.username, // Username must match User DB entry / localstorage username for search purposes.
      username: username,
      price: "",
      rating: "",
      location: "",
      dietary: "",
      atmosphere: "",
    });

    //Add to the database:
    // Add new user:
    await newUser.save();
    // Generate empty preferences list for user:
    await userPreferences.save();

    console.log(`Saved ${newUser.userName} to database successfully!`, "→ collection:", newUser.collection.name);

    // Return final response:
    return res.status(201).json({ message: "Registered", user: { username: newUser.userName, email: newUser.email } });

  } catch (err) {
    return res.status(400).send(err.message);
  }
});

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: path.join(__dirname, "public") }); // <--- Duplicate?
});

// -------- Restaurant Routes --------

// GET all restaurants (for populating search results)
app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // Get all restaurants from DB
    return res.status(200).json(restaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err.message);
    return res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

// POST a new restaurant (for adding restaurants to DB)
app.post("/api/restaurants", async (req, res) => {
  try {
    const newRestaurant = new Restaurant({
      name: req.body.name,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      atmosphere: req.body.atmosphere,
      info: req.body.info
    });
    await newRestaurant.save();
    console.log(`Saved restaurant: ${newRestaurant.name}`);
    return res.status(201).json({ 
      message: "Restaurant added", 
      restaurant: newRestaurant 
    });
  } catch (err) {
    console.error("Error saving restaurant:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

// -------- Review Routes --------

// GET reviews for a specific restaurant
app.get("/api/reviews/:restaurantName", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      restaurantName: req.params.restaurantName 
    }).sort({ createdAt: -1 }); // Sort by newest first
    return res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// GET all reviews by a specific user (for profile page)
app.get("/api/reviews/user/:userName", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      userName: req.params.userName 
    }).sort({ createdAt: -1 }); // Sort by newest first
    console.log(`Found ${reviews.length} reviews for user: ${req.params.userName}`);
    return res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err.message);
    return res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});

// POST a new review
app.post("/api/reviews", async (req, res) => {
  try {
    const {
      rating,
      text,
      restaurantName,
      userName,
      restaurantImage,
      restaurantPrice,
      restaurantAtmosphere,
      restaurantRating,
      restaurantInfo
    } = req.body;

    // Basic validation
    if (!rating || !text || !restaurantName || !userName) {
      return res.status(400).json({ error: "Missing required review fields." });
    }

    // Check if this user already reviewed this restaurant
    const existing = await Review.findOne({
      userName,
      restaurantName
    });

    if (existing) {
      return res
        .status(409) // Conflict
        .json({ error: "You have already submitted a review for this restaurant." });
    }

    // If no existing review, create a new one
    const newReview = new Review({
      rating,
      text,
      restaurantName,
      userName,
      restaurantImage,
      restaurantPrice,
      restaurantAtmosphere,
      restaurantRating,
      restaurantInfo
    });

    await newReview.save();
    console.log(`Saved review for ${newReview.restaurantName} by ${newReview.userName}`);

    return res.status(201).json({
      message: "Review submitted",
      review: newReview
    });
  } catch (err) {
    console.error("Error saving review:", err.message);
    if (err.code === 11000) {
      // Duplicate (userName, restaurantName) according to the unique index
      return res.status(409).json({
        error: "You have already submitted a review for this restaurant."
      });
    }
    return res.status(400).json({ error: err.message });
  }
});


// PUT update a review (user can only update their own reviews)
app.put("/api/reviews/:reviewId", async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userName = req.body.userName; // User making the request
  
    // Find the review first to verify ownership
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Verify the user owns this review
    if (review.userName !== userName) {
      return res.status(403).json({ error: "You can only update your own reviews" });
    }
    
    // Update the review
    review.rating = req.body.rating || review.rating;
    review.text = req.body.text || review.text;
    review.updatedAt = Date.now();
    
    await review.save();
    console.log(`Updated review ${reviewId} by ${userName}`);
    return res.status(200).json({ 
      message: "Review updated successfully", 
      review: review 
    });
  } catch (err) {
    console.error("Error updating review:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

// DELETE a review (user can only delete their own reviews)
app.delete("/api/reviews/:reviewId", async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userName = req.query.userName; // User making the request
    
    // Find the review first to verify ownership
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Verify the user owns this review
    if (review.userName !== userName) {
      return res.status(403).json({ error: "You can only delete your own reviews" });
    }
    
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted review ${reviewId} by ${userName}`);
    return res.status(200).json({ 
      message: "Review deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting review:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

app.get("/api/profile/:userName", async (req, res) => {

  try {
    const foundUser = await User.findOne({
      userName: req.params.userName
    });
    return res.status(200).json(foundUser);

  } catch( err ) {
    console.error("ERROR in user database:", err.message);
    return res.status(500).json({ error:"Failed to fetch user" });
  }
  
});


/**
 * 
 */
app.put("/api/profile-preferences/update/:userName", async (req, res) => {
  
  console.log("HIT /api/profile-preferences/update with", req.params.userName);
  try {

    const userName = req.body.userName; // User making the request

    // Check preferences database for exisitng preference entry:
    const userPreferences = await Preferences.findOne({ userName: req.params.userName });
    if (!userPreferences) {
      return res.status(404).json({ error: "Preferences not found" });
    }
    // Verify preferences belong to the user:
    if ( userPreferences.userName !== userName ) {
      return res.status(403).json({ error: `User preferences do not belong to ${userName}`});
    }

    // Update preference information from request:
    console.log(`REQ price: ${req.body.price}, DB Preferences price: ${userPreferences.price}`);
    userPreferences.price = req.body.price || userPreferences.price;
    userPreferences.rating = req.body.rating || userPreferences.rating;
    userPreferences.location = req.body.location || userPreferences.location;
    userPreferences.dietary = req.body.dietary || userPreferences.dietary;
    userPreferences.atmosphere = req.body.atmosphere || userPreferences.atmosphere;

    // Save new preferences to the preference DB:
    await userPreferences.save();

    console.log(`Updated ${userName} preferences successfully!`, "→ collection:", userPreferences.collection.name);
    // Return final response:
    return res.status(201).json({
      message: "Updated preferences",
      preferences: userPreferences
    });
  }
  catch ( err ) {
    console.error("Error updating preferences:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * /api/profile-preferences/:userName - Retrieves user preferences
 * from user preferences database and returns them in json format:
 */
app.get("/api/profile-preferences/:userName", async (req, res) => {
  console.log("HIT /api/profile-preferences with", req.params.userName);
  try {
    const foundPreferences = await Preferences.findOne({
      userName: req.params.userName
    });
    return res.status(200).json(foundPreferences);

  } catch (err) {
    console.error("ERROR in preferences database:", err.message);
    return res.status(500).json({ error:"Failed to fetch user preferences" });
  }
});

// -------- Bookmark Routes --------
// Add a bookmark to the user
app.post("/api/bookmark", async (req, res) => {
  console.log("HIT api/bookmark");
  try {
    // When user bookmarks, the browser sends the resquested info and req.body stores that
    const { username, restaurant } = req.body;

    // Find matching user in the database, otherwise signal error
    const user = await User.findOne({
      userName: username
    });

    if(!user) return res.status(404).json({
      error: "User not found"
    });

    // Check if the restaurant is already saved
    const exists = user.bookmarks.some(b => b.name === restaurant.name)
    if(exists) return res.json({
      message: "Already bookmarked"
    });

    user.bookmarks.push(restaurant);
    await user.save();

    return res.json({
      message: "Bookmarked successfully", bookmarks: user.bookmarks
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({
      error: "Bookmark failed"
    });
  }
});

// Fetch all bookmarks for a user
app.get("/api/bookmark/:username", async( req, res ) => {
  console.log("HIT /api/bookmarks for", req.params.username);
  try{
    const user = await User.findOne({ 
      userName: req.params.username 
    });

    if (!user) return res.status(404).json({ 
      error: "User not found" 
    });

     // Return bookmarks array (or empty array if none)
     return res.json(user.bookmarks || []);

  } catch(err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to load bookmarks" 
    });
  }
});


// Catch-all for when project files are not found:
app.use((req, res) => {
  res.status(404);
  res.send('<h1>ERROR: Resource(s) not found</h1>');
});

// ====================== Helper methods: =========================



// ====================== Launch Server ===========================

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
  // Maybe also get homepage / search screen?
});