/*
    This script is to be used for the registering of user acocunts.S
*/

// ==============================================================
// User Account registration:

// Track if the user has logged in:
let userLoggedIn = false;

// Function registers a new user and logs them into the system.
// Currently returns fake data.
function registerUser() {
    // Get new user account registratino info:
    let userName = document.getElementById("username").value;
    let userEmail = document.getElementById("email").value;


    checkLoginStatus();
}

function checkLoginStatus() {
    if ( userLoggedIn != true ) {
        console.log("User is not currently logged into a valid account!");
    }
    else {
        console.log("The user is logged in.");
    }
}