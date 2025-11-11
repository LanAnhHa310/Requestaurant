// generate express application object.
const express = require("express");

// Use user model exported from models directory ( connects to the db ).
const User = require("./models/user");

var path = require('path'); // provides utilities for working with file and directory paths.

// ====================== SERVER SETUP ============================

const app = express(); // Set application object equal to express obj.

app.use(express.urlencoded({ extended: false })); // Used to tell the webserver to recognize incoming POST or PUT request data as string / array values.

app.use(express.static(path.join(__dirname + '/public') ) );
// app.use(express.static('public'));

// ========================= METHODS ==============================


// Launcing initial search page:
app.get("/search", (req, res) => {
  console.log("Opening search homepage...");

  // Open search homepage ( homepage.html )
  // res.sendFile(__dirname + '/homepage.html');
  res.sendFile('homepage.html', {root: __dirname + '/public'}); // Olive: Most likely a one-off pathing issue.
  // res.sendFile("homepage.html");
});


// Register new user in DB:
app.post("/register", async (req,res) => {

  // Create new user DB entry from register webpage data:
  console.log(`Request username: ${req.body.username}`); // <-TEST
  const newUser = new User({
    userName: req.body.username,
    password: req.body.password, // Needs to be hashed / secured later if possible!
    email: req.body.email,
  });

  // Add new user to the user database:
  try {
    await newUser.save();
    console.log(`Saved test user to the db!: ${newUser.userName}`);
  } catch {
    // Failed to register new user in DB:
    res.status(400).send(ex.message);
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