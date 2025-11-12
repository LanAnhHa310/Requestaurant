// generate express application object.
const express = require("express");

var path = require('path'); // provides utilities for working with file and directory paths.

// Use user model exported from models directory ( connects to the db ).
const User = require("./models/user");

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

  // // Create new user DB entry from register webpage data:
  // const newUser = new User({
  //   userName: req.body.username,
  //   password: req.body.password, // Needs to be hashed / secured later if possible!
  //   email: req.body.email,
  // });

  // Add new user to the user database:
  // try {
  //   await newUser.save();
  //   console.log(`Saved ${newUser.userName} to database successfully!`);
  // } catch {
  //   // Failed to register new user in DB:
  //   res.status(400).send(ex.message);
  // }

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
 
  // TOKEN: save information to identify which user is logged in.
  // Use a sessionStorage username for now. Not best practice.
  //console.log(`User ${newUser.userName} saved to sessionStorage`)
  //sessionStorage.setItem("currentUser", newUser.userName);
});


// Catch-all for when project files are not found:
app.use((req, res) => {
  res.status(404);
  res.send('<h1>ERROR: Resource(s) not found</h1>');
});

// ====================== Helper methods: =========================

// function validateRegistration( String username, String password, String  ) {

//     let userName = document.getElementById("username").value;
//     let userPassword = document.getElementById("password").value;
//     let userPassConfirm = document.getElementById("passwordConfirm").value;

//     // Check if password has the correct length:
//     let passwordExp = RegExp(".{8}"); // <------ UPDATE: Set some more rules for this.
//     if ( passwordExp.test( userPassword ) == false ) {
//         alert("ERROR: Password is of insufficent length.");
//         return false;
//     }

//     // Check if password entries match:
//     if ( userPassword != userPassConfirm ) {
//         alert("ERROR: Passwords do not match.");
//         return false;
//     }

//     let userEmail = document.getElementById("email").value;

//     // Check that email meets the required pattern:
//     let re = /^(.+)@(.+)/; // <---- UPDATE: Make email validation more exact.
//     let emailCheck = re.test( userEmail );
//     if ( emailCheck == false ) {
//         alert("ERROR: Email invalid.");
//         return false;
//     }

//     return true;
// }


// ====================== Launch Server ===========================

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
  // Maybe also get homepage / search screen?
});