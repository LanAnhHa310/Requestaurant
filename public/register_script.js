/*
    This script is to be used for the registering of user acocunts.S
*/

let submitUserBtn = document.getElementById("userLogIn");

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

// // Track if the user has logged in:
// let userLoggedIn = false;

// Function registers a new user and logs them into the system.
// Currently returns fake data.
function registerUser( event ) {

    event.preventDefault(); // Note: inline form validation stops working when this is enabled.

    // Verify registration information is correct, stops when registration is invalid
    if ( validateRegistration() == false ) {
        console.log("User registration failed: Invalid information entered");
        return;
    }
    
    // Get new user account registration info:
    let userName = document.getElementById("username").value;
    let userEmail = document.getElementById("email").value;

    // Store user data locally (simulate database + login)
        localStorage.setItem("loggedInUser", JSON.stringify({
            name: userName,
            email: userEmail
        }));

    console.log(`Added new user: ${userName} at ${userEmail}`);
    
    // Mark as logged in for this session
    localStorage.setItem("isLoggedIn", "true");
    
    // Confirmation alert
    alert(`Account created successfully! Welcome, ${userName}!`);
    
    // Redirect to homepage
    window.location.href = "homepage.html";
}

// This prevents errors if elements (like the button) don’t exist yet.
document.addEventListener("DOMContentLoaded", () => {
    const submitUserBtn = document.getElementById("userLogIn");
    if (submitUserBtn) {
      submitUserBtn.addEventListener("click", registerUser);
    } else {
      console.error("Could not find #userLogIn button");
    }
});
  