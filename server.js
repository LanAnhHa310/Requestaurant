// ====================== SERVER SETUP ============================

const express = require("express"); // generaste express application object.

const app = express(); // Set application object equal to express obj.

// app.use(express.static('__public/webpages-directory__')); // <--- implement later when project files are better organized.

app.listen(8000, () => {
  console.log("Listening on port 8000...");
  // Maybe also get homepage / search screen?
});

// ================================================================