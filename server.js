// generate express application object.
const express = require("express");

// provides utilities for working with file and directory paths.
var path = require('path'); 

// Use user model exported from models directory ( connects to the db ).
const User = require("./models/user");

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
    
  //Add to the database:
  try {
    await newUser.save();

    console.log(`Saved ${newUser.userName} to database successfully!`, "→ collection:", newUser.collection.name);

    // Return final response:
    return res.status(201).json({ message: "Registered", user: { username: newUser.userName, email: newUser.email } });

  } catch (err) {
    // Failed to register new user in DB:
    return res.status(400).send(err.message);
  }
});


app.get( "/profile", async (req, res) => {
  
  console.log("Retreiving user information...");

  // Get user data:
  try {

    const user = await User.findOne({ userName: req.body.user })
    //const user = await User.find();

  } catch (err) {
    // Failed to find user in DB:
    return res.status(400).send(err.message);
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