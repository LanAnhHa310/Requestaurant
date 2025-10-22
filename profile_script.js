/*
    This script handles the user profile page, which manages all user information including:
    - User account info
    - User preference info
    - User bookmarked restaurants
    - User reviews
*/

window.addEventListener( "DOMContentLoaded", loadedHandler );

function loadedHandler() {

    // Generate list of current stored reviews in database:
    loadReviews();

    // Apply removeBookmark event handler to all bookmarks:
    let bookmarkRemoveBtns = document.getElementsByClassName("remove-bkmk-btn");
    for ( button of bookmarkRemoveBtns ) {
        button.addEventListener( "click", removeBookmark );
    }

    let reviewRemoveBtns = document.getElementsByClassName("remove-review-btn");
    for ( button of reviewRemoveBtns ) {
        button.addEventListener( "click", removeReview );
    }
   
    let reviewUpdateBtns = document.getElementsByClassName("update-review-btn");
    for ( button of reviewUpdateBtns ) {
        button.addEventListener( "click", updateReview );
    }
}

// ====================================================================================
// Setup functionality to edit user acocunt info ( username, email ):

// ====================================================================================
// Setup functionality to add / remove user preferences from the preference list:

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
    console.log("Retrieved user review data!");

    let review = document.createElement("div");
    review.className = "review";
    review.innerHTML = `
    <button class="remove-review-btn">Remove</button>
    <img src="${revData.image}" alt="${revData.name}" class="restaurant-img">
    <div class="restaurant-details">
        <h4>${revData.name}</h4>
        <p>${revData.rating}</p>
        <p>${revData.info}</p>
    </div>
    <p>Your Review:</p>
    <form class="review-form">
        <input type="text" class="review-text" value="${ revObj.reviewText }">
        <button type="submit" class="update-review-btn">Update Review</button>
    </form>
    `;
    userReviews.appendChild(review);
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
    console.log("Removed review successfully!");
}
