const express = require("express"); // generaste express application object.

const mongoose = require("mongoose"); // require mongoose for ease of DB operations.

var path = require('path'); // provides utilities for working with file and directory paths.

// ====================== SERVER / DATABASE SETUP ============================
const app = express(); // Set application object equal to express obj.

app.use(express.static(path.join(__dirname + '/public') ) ); // <--- implement later when project files are better organized.
// app.use(express.static('public'));

// Connect to user database:
mongoose.connect("mongodb://localhost/requestaurant-db");

// ================================================================

// Setup schema:
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
});

// Create access connection with db:
const User = mongoose.model( "User", userSchema);

// app method for launcing initial search page:
app.get('/search', (req, res) => {
  console.log("Opening search homepage...");

  // Open search homepage ( homepage.html )
  // res.sendFile(__dirname + '/homepage.html');
  res.sendFile('homepage.html', {root: __dirname + '/public'});
  // res.sendFile("homepage.html");
});


// METHOD: Register new user in DB:
app.post('/register', async (req,res) => {

  // Create new user DB entry from register webpage data:
  const newUser = new User({
    //userName: "Testy",
    userName: req.body.username,
  });

  // Add new user to the user database:
  try {
    await newUser.save();
    console.log(`Saved test user to the db!: ${newUser.userName}`);
  }
  catch {
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