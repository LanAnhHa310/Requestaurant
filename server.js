// ====================== SERVER SETUP ============================

const express = require("express"); // generaste express application object.

var path = require('path'); // provides utilities for working with file and directory paths.

const app = express(); // Set application object equal to express obj.

app.use(express.static(path.join(__dirname + '/public') ) ); // <--- implement later when project files are better organized.
// app.use(express.static('public'));

// ================================================================

// app method for launcing initial search page:
app.get('/search', (req, res) => {
  console.log("Opening search homepage...");
  // Open search homepage ( homepage.html )
  // res.sendFile(__dirname + '/homepage.html');
  res.sendFile('homepage.html', {root: __dirname + '/public'});
  // res.sendFile("homepage.html");
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