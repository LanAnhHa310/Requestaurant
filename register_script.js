/*
    This script is to be used for the registering of user acocunts.S
*/

let submitUserBtn = document.getElementById("submit-user");

// ==============================================================
// User Account information validation:

// When the user presses the "Create account" button, check that all entered information is valid:

function validateRegistration() {

    let userName = document.getElementById("username").value;

    // Implement later: Check if the username already exists in the database:

    console.log("Does any of this get displayed?");

    let userPassword = document.getElementById("password").value;

    let userPassConfirm = document.getElementById("passwordConfirm").value;
    
    let userEmail = document.getElementById("email").value;
}

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

submitUserBtn.addEventListener( "click", validateRegistration );

