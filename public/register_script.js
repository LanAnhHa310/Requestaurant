/*
    This script is to be used for the registering of user acocunts.S
*/

// Assign eventhandlers after all html webpage content ( buttons, inputs, etc. ) are loded.
document.addEventListener("DOMContentLoaded", () => {
    
    const submitUserBtn = document.getElementById("userLogIn");
    const form = document.getElementById("register-form");

    // Add event listener to submission button
    if (submitUserBtn) {
        //submitUserBtn.addEventListener("click", registerUser);
    } else {
      console.error("Could not find #userLogIn button");
    }

    // Add event listener to the form itself:
    form.addEventListener("submit", registerUser);
});

// ==============================================================
// User Account information validation:

// When the user presses the "Create account" button, check that all entered information is valid:

function validateRegistration() {

    let userName = document.getElementById("username").value;

    // Implement later: Check if the username already exists in the database:

    let userPassword = document.getElementById("password").value;
    let userPassConfirm = document.getElementById("passwordConfirm").value;

    // Check if password has the correct length:
    let passwordExp = RegExp(".{8}"); // <------ UPDATE: Set some more rules for this.
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

    // Verify registration information is correct, stops when registration is invalid:
    if ( validateRegistration() == false ) {
        console.log("User registration failed: Invalid information entered");
        return;
    }
    
    // Get new user account registration info:
    let userName = document.getElementById("username").value;
    let userEmail = document.getElementById("email").value;

    // Submit the form data:
    console.log("Submitting form data...");
    //document.getElementById("register-form").submit();
    
    
    // Mark as logged in for this session
    localStorage.setItem("isLoggedIn", "true");
    
    // Confirmation alert
    alert(`Account created successfully! Welcome, ${userName}!`);
    
    // Redirect to homepage
    window.location.href = "homepage.html";
}
  