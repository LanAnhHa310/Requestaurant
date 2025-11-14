/*
    This script is to be used for the registering of user acocunts.S
*/

// Assign eventhandlers after all html webpage content ( buttons, inputs, etc. ) are loded.
document.addEventListener("DOMContentLoaded", () => {
    
    // const submitUserBtn = document.getElementById("userLogIn");
    const form = document.getElementById("register-form");

    // // Add event listener to submission button
    // if (submitUserBtn) {
    //     submitUserBtn.addEventListener("click", registerUser); // <------ Using form instead to assign event handler.
    // } else {
    //   console.error("Could not find #userLogIn button");
    // }

    if (!form) return console.error("Missing #register-form");
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

// Function registers a new user and logs them into the system.
// Currently returns fake data.
async function registerUser( event ) {

    event.preventDefault(); // Note: inline form validation stops working when this is enabled.

    // Verify registration information is correct, stops when registration is invalid:
    if ( validateRegistration() == false ) {
        console.log("User registration failed: Invalid information entered");
        return;
    }
    console.log("Registration validation passed.");
    
    // Generate user from registration form data:
    const newUser = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
    }

    // POST json-encoded registration form data via (register/) request:
    console.log("Submitting form data...");

    const response = await fetch("/register", { // <--- Pretty sure this is the problem.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
    });

    if(!response.ok) {
        const msg = await response.text().catch(() => "");
        alert(`Could not create account: ${msg || response.status}`);
        return;
    }
    // Access specific values from response object
    const data = await response.json();
    
    // Mark as logged in for this session
    localStorage.setItem( "isLoggedIn", "true" );

    // TOKEN: Ensure website recognizes which user is currently logged in:
    localStorage.setItem( "currentUser", newUser.username );
    
    // Store user info for profile and reviews (username is used for review ownership)
    localStorage.setItem("loggedInUser", JSON.stringify({
        username: newUser.username,
        email: newUser.email
    }));

    // Confirmation alert
    //alert(`Account created successfully! Welcome, ${newUser.username}!`);
    alert(`Account created successfully! Welcome, ${ data.user.username }`)
    
    // Redirect to homepage
    // window.location.href = "homepage.html";
    window.location.href = "/";
}
  