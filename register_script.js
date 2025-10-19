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

    let userPassword = document.getElementById("password").value;
    let userPassConfirm = document.getElementById("passwordConfirm").value;

    // Check if password entries match:
    if ( userPassword != userPassConfirm ) {
        alert("ERROR: Passwords do not match.");
    }

    let userEmail = document.getElementById("email").value;

    // Check that email meets the required pattern:
    let re = /^(.+)@(.+)\.(\D){2-3}/;
    let emailCheck = re.test( userEmail );
    if ( emailCheck == false ) {
        alert("ERROR: Email invalid."); // <---- BROKEN.
    }
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

