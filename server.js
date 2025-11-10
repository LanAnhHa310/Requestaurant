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
app.get('/search', async (req, res) => {
  console.log("Opening search homepage...");

  // Open search homepage ( homepage.html )
  // res.sendFile(__dirname + '/homepage.html');
  res.sendFile('homepage.html', {root: __dirname + '/public'});
  // res.sendFile("homepage.html");

  // ------ TEST: add user data to db: -----------
  const newUser = new User({
    userName: "Testy",
  });

  await newUser.save();
  console.log(`Saved test user to the db!: ${newUser.userName}`);
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