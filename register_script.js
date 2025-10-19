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

    // Check if password has the correct length:
    let passwordExp = RegExp(".{8}"); // <------ UPDATE: Set soem more rules for this.
    if ( passwordExp.test( userPassword ) == false ) {
        alert("ERROR: Password is of insufficent length.");
        return false;
    }

    // Check if password entries match:
    if ( userPassword != userPassConfirm ) {
        alert("ERROR: Passwords do not match.");
        return false;
    }

    let userEmail = document.getElementById("email").value;

    // Check that email meets the required pattern:
    let re = /^(.+)@(.+)/; // <---- UPDATE: Make email validation more exact.
    let emailCheck = re.test( userEmail );
    if ( emailCheck == false ) {
        alert("ERROR: Email invalid.");
        return false;
    }

    return true;
}

// ==============================================================
// User Account registration:

// Track if the user has logged in:
let userLoggedIn = false;

// Function registers a new user and logs them into the system.
// Currently returns fake data.
function registerUser( event ) {

    event.preventDefault(); // Note: inline form validation stops working when this is enabled.

    // Verify registration information is correct:
    if ( validateRegistration() == false ) {
        console.log("User registration failed: Invalid information entered");
    }
    else {
        // Get new user account registration info:
        let userName = document.getElementById("username").value;
        let userEmail = document.getElementById("email").value;

        console.log(`Added new user: ${userName} at ${userEmail}`);
        userLoggedIn = true; // Log-in the user. This will probably need to change in the future.
    }

    // Check user login was successful:
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

submitUserBtn.addEventListener( "click", registerUser );

