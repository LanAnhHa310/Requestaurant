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
    loadReviews();

    // Apply removeBookmark event handler to all bookmarks:
    let bookmarkRemoveBtns = document.getElementsByClassName("remove-bkmk-btn");
    for ( let button of bookmarkRemoveBtns ) {
        button.addEventListener( "click", removeBookmark );
    }

    // let reviewRemoveBtns = document.getElementsByClassName("remove-review-btn");
    // for ( let button of reviewRemoveBtns ) {
    //     button.addEventListener( "click", removeReview );
    // }
   
    // let reviewUpdateBtns = document.getElementsByClassName("update-review-btn");
    // for ( let button of reviewUpdateBtns ) {
    //     button.addEventListener( "click", updateReview );
    // }
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

    //let userInfo = localStorage.getItem("loggedInUser");
    //userInfo = JSON.parse(userInfo);

    // let pageTitle = document.getElementsByTagName("h1")[0];
    // let usernameDisplay = document.getElementById("usernameDisplay");
    // let emailDisplay = document.getElementById("emailDisplay");

    // pageTitle.textContent = `${userInfo.name}'s Profile`;
    // usernameDisplay.textContent = `Username: ${userInfo.name}`;
    // emailDisplay.textContent = `Email: ${userInfo.email}`;
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
async function loadReviews() {
    const userReviewsContainer = document.getElementById("user-reviews");
    userReviewsContainer.innerHTML = "<p>Loading your reviews...</p>";

    // Get logged-in user
    const userInfo = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

    if (!userInfo.username) {
        userReviewsContainer.innerHTML = "<p>Please log in to view your reviews.</p>";
        return;
    }

    try {
        // Fetch user's reviews from database
        const response = await fetch(`/api/reviews/user/${encodeURIComponent(userInfo.username)}`);
        
        if (!response.ok) throw new Error("Failed to fetch reviews");
        
        const reviews = await response.json();
        
        if (!reviews || reviews.length === 0) {
            userReviewsContainer.innerHTML = "<p>You haven't written any reviews yet.</p>";
            return;
        }
        // Clear loading message
        userReviewsContainer.innerHTML = "";
        
        // Display each review
        reviews.forEach((review) => {
            createReviewCard(review, userReviewsContainer);
        });

        console.log(`Loaded ${reviews.length} reviews for ${userInfo.username}`);
    } catch (err) {
        console.error("Error loading reviews:", err);
        userReviewsContainer.innerHTML = "<p>Error loading reviews. Please try again.</p>";
    }
}

// Helper function to create a review card element
function createReviewCard(review, container) {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    reviewDiv.dataset.reviewId = review._id; // Store review ID for update/delete
    
    // Use stored restaurant image or placeholder
    const imgSrc = review.restaurantImage || "https://placehold.co/200x200?text=Restaurant";
    
    reviewDiv.innerHTML = `
        <button class="remove-review-btn" data-review-id="${review._id}">Delete Review</button>
        <img src="${imgSrc}" alt="${review.restaurantName}">
        <h3>${review.restaurantName}</h3>
        <p>${review.restaurantPrice || ""} • ${review.restaurantAtmosphere || ""} • ${review.restaurantRating || ""}</p>
        <p>${review.restaurantInfo || ""}</p>
        <p><strong>Your Rating:</strong> ${review.rating}★</p>
        <p><strong>Your Review:</strong></p>
        <form class="review-form" data-review-id="${review._id}">
            <label for="rating-${review._id}">Rating:</label>
            <select id="rating-${review._id}" class="review-rating" required>
                <option value="5" ${review.rating === 5 ? 'selected' : ''}>5★</option>
                <option value="4" ${review.rating === 4 ? 'selected' : ''}>4★</option>
                <option value="3" ${review.rating === 3 ? 'selected' : ''}>3★</option>
                <option value="2" ${review.rating === 2 ? 'selected' : ''}>2★</option>
                <option value="1" ${review.rating === 1 ? 'selected' : ''}>1★</option>
            </select>
            <textarea class="review-text" rows="4" required>${review.text}</textarea>
            <button type="submit" class="update-review-btn">Update Review</button>
        </form>
        <p class="review-date"><small>Posted: ${new Date(review.createdAt).toLocaleDateString()}</small></p>
    `;
    
    container.appendChild(reviewDiv);
    
    // Attach event listeners to the new elements
    const deleteBtn = reviewDiv.querySelector(".remove-review-btn");
    deleteBtn.addEventListener("click", deleteReview);
    
    const updateForm = reviewDiv.querySelector(".review-form");
    updateForm.addEventListener("submit", updateReview);
}

// UPDATE: Update an existing review
async function updateReview( event ) {
    const form = event.target;
    const reviewId = form.dataset.reviewId;
    const newRating = form.querySelector(".review-rating").value;
    const newText = form.querySelector(".review-text").value.trim();
    
    if (!newText) {
        alert("Review text cannot be empty!");
        return;
    }
    
    // Get logged-in user
    const userInfo = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    
    if (!userInfo.username) {
        alert("You must be logged in to update reviews.");
        return;
    }

    try {
        // Send PUT request to update review
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                rating: parseInt(newRating),
                text: newText,
                userName: userInfo.username
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update review");
        }

        const result = await response.json();
        console.log("Review updated:", result);
        alert("Review updated successfully!");
        
        // Reload reviews to show updated data
        await loadReviews();
    } catch (err) {
        console.error("Error updating review:", err);
        alert(`Failed to update review: ${err.message}`);
    }
}

// DELETE: Remove a review
async function deleteReview(event) {
    const button = event.target;
    const reviewId = button.dataset.reviewId;
    
    // Confirm deletion
    const confirmDelete = confirm("Are you sure you want to delete this review? This action cannot be undone.");
    if (!confirmDelete) return;
    
    // Get logged-in user
    const userInfo = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    
    if (!userInfo.username) {
        alert("You must be logged in to delete reviews.");
        return;
    }

    try {
        // Send DELETE request
        const response = await fetch(`/api/reviews/${reviewId}?userName=${encodeURIComponent(userInfo.username)}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to delete review");
        }

        const result = await response.json();
        console.log("Review deleted:", result);
        alert("Review deleted successfully!");
        
        // Remove the review card from DOM
        const reviewDiv = button.closest(".review");
        reviewDiv.remove();
        
        // Check if there are any reviews left
        const reviewsContainer = document.getElementById("user-reviews");
        if (reviewsContainer.children.length === 0) {
            reviewsContainer.innerHTML = "<p>You haven't written any reviews yet.</p>";
        }
    } catch (err) {
        console.error("Error deleting review:", err);
        alert(`Failed to delete review: ${err.message}`);
    }
}