// ====================== SERVER SETUP ============================

const express = require("express"); // generaste express application object.

var path = require('path'); // provides utilities for working with file and directory paths.

const app = express(); // Set application object equal to express obj.

// app.use(express.static('__public/webpages-directory__')); // <--- implement later when project files are better organized.

// ================================================================


// app method for launcing initial search page:
app.get('/', (req, res) => {
    console.log("Opening search homepage...");
    // Open search homepage ( homepage.html )
    res.sendFile(__dirname + '/homepage.html');
});


// ====================== Launch Server ===========================

app.listen(8000, () => {
  console.log("Listening on port 8000...");
  // Maybe also get homepage / search screen?
});