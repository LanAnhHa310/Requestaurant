// generate express application object.
const express = require("express");
var path = require('path'); // provides utilities for working with file and directory paths.

// Use user model exported from models directory ( connects to the db ).
const User = require("./models/user");
const Review = require("./models/review");
const Restaurant = require("./models/restaurant");

// ====================== SERVER SETUP ============================

const app = express();

// Parse JSON and form bodies
app.use(express.json()); // Set application object equal to express obj.

app.use(express.urlencoded({ extended: false })); // Used to tell the webserver to recognize incoming POST or PUT request data as string / array values.

app.use(express.static(path.join(__dirname + '/public') ) );
// app.use(express.static('public'));

// ========================= METHODS ==============================

/*
  /search method: Tells the webserver to open the homepage,
  which displays the search menu for restaurants.
*/
app.get("/search", (req, res) => {
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
    const newUser = new User({
      userName: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    await newUser.save();
    console.log(`Saved ${newUser.userName} to database successfully!`, "→ collection:", newUser.collection.name);
    return res.status(201).json({ message: "Registered", user: { username: newUser.userName, email: newUser.email } });
    } catch (err) {
      return res.status(400).send(err.message);
    }
});

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: path.join(__dirname, "public") });
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

// POST a new review
app.post("/api/reviews", async (req, res) => {
  try {
    const newReview = new Review({
      rating: req.body.rating,
      text: req.body.text,
      restaurantName: req.body.restaurantName,
      userName: req.body.userName || "Anonymous" // Optional user tracking
    });
    await newReview.save();
    console.log(`Saved review for ${newReview.restaurantName}`);
    return res.status(201).json({ 
      message: "Review submitted", 
      review: newReview 
    });
  } catch (err) {
    console.error("Error saving review:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

// Catch-all for when project files are not found:
app.use((req, res) => {
  res.status(404);
  res.send('<h1>ERROR: Resource(s) not found</h1>');
});

// ====================== Launch Server ===========================

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
  // Maybe also get homepage / search screen?
});