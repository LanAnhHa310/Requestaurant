// generate express application object.
const express = require("express");

// provides utilities for working with file and directory paths.
var path = require('path'); 

// Use user model exported from models directory ( connects to the db ).
const User = require("./models/user");
// Preferences model used to store user restaurant preferences:
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

  // Create new user DB entry from register webpage data:
  const newUser = new User({
    userName: req.body.username,
    password: req.body.password, // Needs to be hashed / secured later if possible!
    email: req.body.email,
  });
  
  // Generate empty preferences list for user:
  const userPreferences = new Preferences({
    userName: req.body.username,
    price: "3.00",
    rating: 4,
    dietary: "Sandwich",
    atmosphere: "Romantic",
  });

  //Add to the database:
  try {
    // Add new user:
    await newUser.save();
    // Generate empty preferences list for user:
    await userPreferences.save();

    console.log(`Saved ${newUser.userName} to database successfully!`, "→ collection:", newUser.collection.name);

    // Return final response:
    return res.status(201).json({ message: "Registered", user: { username: newUser.userName, email: newUser.email } });

  } catch (err) {
    // Failed to register new user in DB:
    return res.status(400).send(err.message);
  }
});


// app.post( "/profile", async (req, res) => {
  
//   console.log("Retreiving user information...");

//   // Get user data:
//   try {

//     // Look for databse username that matches the request localStorage username.
//     const foundUser = await User.findOne({ userName: req.body.searchName });

//     // Return final response:
//     return res.status(201).json({ message: "User found", foundUser });

//   } catch (err) {
//     // Failed to find user in DB:
//     return res.status(400).send(err.message);
//   }
  
  
// });

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


app.get("api/profile-preferences/:userName", async (req, res) => {

  try {
    const foundPreferences = await Preferences.findOne({
      userName: req.params.userName,
    });
    return res.status(200).json(foundPreferences);

  } catch (err) {
    console.error("ERROR in preferences database:", err.message);
    return res.status(500).json({ error:"Failed to fetch user preferences" });
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