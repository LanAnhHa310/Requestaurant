/*
    This script handles the user profile page, which manages all user information including:
    - User account info
    - User preference info
    - User bookmarked restaurants
    - User reviews
*/

window.addEventListener( "DOMContentLoaded", loadedHandler );

function loadedHandler() {

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
    console.log("Removed bookmark!");
}

// ====================================================================================
// Add functionality for removing / editing restaurant reviews:

// Load in reviews for user:

// Edit user review:
function updateReview( event ) {
    event.preventDefault();
    console.log("Updated review successfully!");
}

// Remove user review:
function removeReview( event ) {
    let review = event.target.parentNode;
    review.parentNode.removeChild(review);
    console.log("Removed user review successfully!");
}
