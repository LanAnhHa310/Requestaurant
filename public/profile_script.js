/*
    This script handles the user profile page, which manages all user information including:
    - User account info
    - User preference info
    - User bookmarked restaurants
    - User reviews
*/

window.addEventListener( "DOMContentLoaded", loadedHandler );

function loadedHandler() {

    // Update profile with newest user information:
    loadUserInfo();

    // Generate list of current stored reviews in database:
    //loadReviews();

    // Apply removeBookmark event handler to all bookmarks:
    let bookmarkRemoveBtns = document.getElementsByClassName("remove-bkmk-btn");
    for ( let button of bookmarkRemoveBtns ) {
        button.addEventListener( "click", removeBookmark );
    }

    let reviewRemoveBtns = document.getElementsByClassName("remove-review-btn");
    for ( let button of reviewRemoveBtns ) {
        button.addEventListener( "click", removeReview );
    }
   
    let reviewUpdateBtns = document.getElementsByClassName("update-review-btn");
    for ( let button of reviewUpdateBtns ) {
        button.addEventListener( "click", updateReview );
    }
}

// ====================================================================================
// Setup functionality to edit user account info ( username, email ):

// Load in current user information from database:
async function loadUserInfo() {

    // Access the database:
    const response = await fetch(`/api/profile/${localStorage.getItem("currentUser")}`);

    // Check that user was fetched successfully:
    if ( !response.ok ) {
        throw new Error("Failed to retrieve logged-in user data");
    }

    const userInfo = await response.json();

    // Place user information into webpage:
    document.getElementsByTagName("h1")[0].textContent = `${userInfo.userName}'s Profile`;
    document.getElementById("usernameDisplay").textContent = `Username: ${userInfo.userName}`;
    document.getElementById("emailDisplay").textContent = `Email: ${userInfo.email}`;

    // Place user preferences into preferences tab:
    
}

/* FUNCTION EXCEEDS PD2 SCOPE
// Update user info when requested:
function updateUserInfo( event ) {

    // Hide old user info
    let infoDisplay = document.getElementById("user-info");
    infoDisplay.style.display = "none";

    // Show user information update panel:

    // Once new information is submitted, update the database:
    let oldUserInfo = localStorage.getItem("loggedInUser");
    newUserInfo = JSON.parse(oldUserInfo);
    //newUserInfo.name = 
    //newUserInfo.email = 
}
*/

// ====================================================================================
// Setup functionality to add / remove user preferences from the preference list:

function updatePreferences() {

}

// ====================================================================================
// Add functionality for removing bookmarked restaurants:

// Load in bookmarks for user:

// Remove bookmarked restaurant event handler function:
function removeBookmark( event ) {
    let button = event.target;
    // Get the <div> of the clicked bookmark:
    let parent = button.parentNode;
    parent.parentNode.removeChild(parent);
    console.log("Removed bookmark successfully!");
}

// ====================================================================================
// Add functionality for removing / editing restaurant reviews:

// Load in reviews for user:
function loadReviews() {

    let userReviews = document.getElementById("user-reviews");

    // Get the stored reviews:
    let revData = localStorage.getItem("firstReview");
    let revObj = JSON.parse( revData );
    if ( (revObj.name != null) || (revObj != "") ) {
        console.log("Retrieved user review data!");

        // Create the review div:
        let review = document.createElement("div");
        review.className = "review";
        review.innerHTML = `
            <button class="remove-review-btn">Remove</button>
            <img src="${revObj.image}" alt="${revObj.name}" class="restaurant-img">
            <div class="restaurant-details">
                <h4>${revObj.name}</h4>
                <p>${revObj.rating}</p>
                <p>${revObj.info}</p>
            </div>
            <p>Your Review:</p>
            <form class="review-form">
                <input type="text" class="review-text" value="${ revObj.reviewText }">
                <button type="submit" class="update-review-btn">Update Review</button>
            </form>
        `;
        // Add the review display:
        userReviews.appendChild(review);
    }
    
}
   
// Edit user review:
function updateReview( event ) {
    event.preventDefault();
    console.log("Updated review successfully!");
}

// Remove user review:
function removeReview( event ) {
    let review = event.target.parentNode;
    review.parentNode.removeChild(review);
    // Clear review data?
    localStorage.removeItem("firstReview");
    console.log("Removed review successfully!");
}
