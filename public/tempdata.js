/*
This script holds data reguarding user preferences, bookmarked restaurants, and restuarant reviews.
*/

// Hold user restaurant reviews:

const reviewForm = document.getElementById("review-form");

reviewForm.addEventListener("submit", storeUserReview );


function storeUserReview( event ) {
    event.preventDefault();

    // Get the existing list of stored user reviews:
    let storedReviews = JSON.parse( localStorage.getItem("allReviews"));

    // If the existing list is empty, just make a new one:
    if ( storedReviews == null ) {
        storedReviews = [];
    }

    // Create the new review item:
    let reviewText = document.getElementById("review-text");
    reviewText = reviewText.value.trim();

    let review = {
        "reviewText": reviewText,
    };

    // Add the new review item to local storage.
    localStorage.setItem("review", JSON.stringify( review ));

    storedReviews.push( review );

    localStorage.setItem("allReviews", JSON.stringify( storedReviews ));

}