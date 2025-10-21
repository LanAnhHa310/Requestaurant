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

   
}

// Setup functionality to edit user acocunt info ( username, email ):

// Setup functionality to add / remove user preferences from the preference list:

// Add functionality for removing bookmarked restaurants:

// Remove bookmarked restaurant event handler function:
function removeBookmark( event ) {
    // Get the <div> of the clicked bookmark:
    let parent = event.target.parentNode.parentNode;
    console.log(`${parent}`);
    parent.parentNode.removeChild.parent;
    
    console.log("Removed bookmark!");
}

// Add functionality for removing / editing restaurant reviews:

