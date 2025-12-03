// Restaurant Search + Review webpage

// Elements
const searchForm = document.getElementById("searchForm");
const resultList = document.getElementById("result-grid");
const popup = document.getElementById("restaurant-popup");
const closePopup = document.getElementById("close-popup");
const popupImg = document.getElementById("popup-image");
const restaurantName = document.getElementById("restaurant-name");
const restaurantInfo = document.getElementById("restaurant-info");
const restaurantRating = document.getElementById("restaurant-rating");
const reviewForm = document.getElementById("review-form");
const reviewText = document.getElementById("review-text");
const reviewRatingSelect = document.getElementById("review-rating");
const reviewsList = document.getElementById("reviews-list");

let currentRestaurant = null;

// ==================== SEARCH FUNCTIONALITY ====================

// Handle search - now fetches from database instead of hardcoded array
if (searchForm) {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("q").value.trim().toLowerCase();
    resultList.innerHTML = "<p>Loading restaurants...</p>";

    if (!query) {
      alert("Please enter a search term!");
      return;
    }

    try {
      // Fetch restaurants from database via API
      const response = await fetch("/api/restaurants");
      if (!response.ok) throw new Error("Failed to fetch restaurants");
      
      const results = await response.json();

      // Filter results based on search query
      const filtered = results.filter((r) => {
        const searchableText = `
          ${r.name} ${r.info} ${r.atmosphere} ${r.price} ${r.rating}
        `.toLowerCase();
        return searchableText.includes(query);
      });

      // Display results
      if (filtered.length === 0) {
        resultList.innerHTML = `<p>No restaurants found for "${query}".</p>`;
        return;
      }

      resultList.innerHTML = ""; // Clear loading message
      filtered.forEach((r) => {
        const imgSrc = r.image && r.image.trim() !== ""
          ? r.image
          : "https://placehold.co/200x200?text=Restaurant";
      
        const card = document.createElement("div");
        card.className = "restaurant-card";
        card.innerHTML = `
          <img src="${imgSrc}" alt="${r.name}" class="restaurant-img">
          <div class="restaurant-details">
            <h4>${r.name}</h4>
            <p>${r.price} • ${r.atmosphere} • ${r.rating}</p>
            <p>${r.info}</p>
          </div>
        `;
        card.addEventListener("click", () => openPopup(r));
        resultList.appendChild(card);
      });
    } catch (err) {
      console.error("Search error:", err);
      resultList.innerHTML = "<p>Error loading restaurants. Please try again.</p>";
    }
  });
}

/**
 * 
 */
async function searchWithPreferences( event ) {

  // prevent the search form from submitting:
  event.preventDefault();

  // Access the user preferences:
  console.log(`Loading DB preferences into search for user: ${localStorage.getItem("currentUser")}...`);
  const prefResponse = await fetch(`/api/profile-preferences/${localStorage.getItem("currentUser")}`);

  // Check that user was fetched successfully:
  if ( !prefResponse.ok ) {
      throw new Error("Failed to retrieve user preference data");
  }
  const searchPreferences = await prefResponse.json();

  // Once retrieved, load the user preferences into the search form fields:
  document.getElementById("price").value = searchPreferences.price;
  document.getElementById("rating").value = searchPreferences.rating;
  document.getElementById("location").value = searchPreferences.location;
  document.getElementById("dietary").value = searchPreferences.dietary;
  document.getElementById("atmosphere").value = searchPreferences.atmosphere;

  console.log("Preferences successfully loaded to search form.");
  return;
}

// ==================== POPUP & REVIEW FUNCTIONALITY ====================

// Open popup and load reviews from database
async function openPopup(r) {
  popupImg.src = r.image;
  restaurantName.textContent = r.name;
  restaurantInfo.textContent = r.info;
  restaurantRating.textContent = `${r.price} • ${r.atmosphere} • ${r.rating}`;
  currentRestaurant = r; // Store full restaurant object (not just name)

  // Check if user is logged in and show/hide review form accordingly
  checkLoginStatusForReviews();

  await loadReviews(r.name); // Load reviews from database
  popup.classList.remove("hidden");
}

// Check login status and enable/disable review form
function checkLoginStatusForReviews() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const reviewFormSection = document.getElementById("review-form");
  const reviewRatingSelect = document.getElementById("review-rating");
  const reviewTextArea = document.getElementById("review-text");
  const submitButton = reviewFormSection ? reviewFormSection.querySelector('button[type="submit"]') : null;
  
  if (!isLoggedIn) {
    // Disable the form and show login message
    if (reviewFormSection) {
      // Add a login message before the form
      let loginMessage = document.getElementById("login-message");
      if (!loginMessage) {
        loginMessage = document.createElement("p");
        loginMessage.id = "login-message";
        loginMessage.style.color = "#ff5a5f";
        loginMessage.style.fontWeight = "bold";
        loginMessage.innerHTML = 'You must <a href="register.html" style="color: #ff5a5f; text-decoration: underline;">create an account</a> to leave a review.';
        reviewFormSection.parentNode.insertBefore(loginMessage, reviewFormSection);
      }
      
      // Disable all form inputs
      if (reviewRatingSelect) reviewRatingSelect.disabled = true;
      if (reviewTextArea) {
        reviewTextArea.disabled = true;
        reviewTextArea.placeholder = "Please log in to write a review...";
      }
      if (submitButton) submitButton.disabled = true;
    }
  } else {
    // Enable the form and remove login message
    const loginMessage = document.getElementById("login-message");
    if (loginMessage) loginMessage.remove();
    
    if (reviewRatingSelect) reviewRatingSelect.disabled = false;
    if (reviewTextArea) {
      reviewTextArea.disabled = false;
      reviewTextArea.placeholder = "Write your review...";
    }
    if (submitButton) submitButton.disabled = false;
  }
}

if(closePopup) {
  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
}

// Submit review to database
if(reviewForm) {
  reviewForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    const rating = reviewRatingSelect.value;
    const text = reviewText.value.trim();

    if (!rating || !text) {
      alert("Please complete both fields before submitting.");
      return;
    }

    // Get current logged-in user
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    
    if (!isLoggedIn || !loggedInUser.username) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      // POST review to database
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          rating: parseInt(rating),
          text: text,
          restaurantName: currentRestaurant.name,
          userName: loggedInUser.username,
          // Store restaurant details for profile page display
          restaurantImage: currentRestaurant.image,
          restaurantPrice: currentRestaurant.price,
          restaurantAtmosphere: currentRestaurant.atmosphere,
          restaurantRating: currentRestaurant.rating,
          restaurantInfo: currentRestaurant.info
        })
      });

      if(!response.ok) throw new Error("Failed to submit review")

      const result = await response.json();
      console.log("Review saved:", result);

      //Reload reviews and reset form
      await loadReviews(currentRestaurant.name); //passing the correct string
      reviewForm.reset();
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Failed to submit review. Please try again.")
    }
  }
)};

// Load reviews from database
async function loadReviews(name) {
  reviewsList.innerHTML = "<p>Loading reviews....</p>";

  try {
    // GET reviews from database
    const response = await fetch(`/api/reviews/${encodeURIComponent(name)}`);
    if(!response.ok) throw new Error("Failed to fetch reviews");

    const reviews = await response.json();

    if (!reviews || reviews.length === 0) {
      reviewsList.innerHTML = "<p>No reviews yet. Be the first to leave one!</p>";
      return;
    }

    reviewsList.innerHTML = ""; // Clear loading message
    reviews.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `${r.rating}★ - ${r.text}`;
      reviewsList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading reviews:", err);
    reviewsList.innerHTML = "<p>Error loading reviews.</p>";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded");

  //Dark mode and accessbility and performance
  const darkToggleBtn = document.getElementById("dark-mode");
  const accessToggleBtn = document.getElementById("disability-mode");
  const performToggleBtn = document.getElementById("performance-mode");

  // Load saved preferences
  const savedTheme = localStorage.getItem("theme");
  const savedAccessibility = localStorage.getItem("accessibility");
  const savedPerform = localStorage.getItem("performance");

  // Apply to every page
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  if (savedAccessibility === "on") document.body.classList.add("disability-mode");
  if (savedPerform === "on") document.body.classList.add("performance-mode");

  // Only attach listeners if checkboxes exist (i.e., on settings.html)
  if (darkToggleBtn) {
    darkToggleBtn.checked = savedTheme === "dark";
    darkToggleBtn.addEventListener("change", () => {
      const isDark = darkToggleBtn.checked;
      document.body.classList.toggle("dark-mode", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  if (accessToggleBtn) {
    accessToggleBtn.checked = savedAccessibility === "on";
    accessToggleBtn.addEventListener("change", () => {
      const isOn = accessToggleBtn.checked;
      document.body.classList.toggle("disability-mode", isOn);
      localStorage.setItem("accessibility", isOn ? "on" : "off");
    });
  }

  if(performToggleBtn) {
    performToggleBtn.checked = savedPerform === "on";
    performToggleBtn.addEventListener("change", () => {
      const isOn = performToggleBtn.checked;
      document.body.classList.toggle("performance-mode", isOn);
      localStorage.setItem("performance", isOn ? "on" : "off");
    });
  }

  // Login state
  const createBtn = document.getElementById("create-btn");
  const profileBtn = document.getElementById("profile-btn");

  // Get the ID of the button with auto-fills the search form with user preferences
  const addPrefsButton = document.getElementById("prefLoadBtn");
  addPrefsButton.addEventListener("click", searchWithPreferences);
  
  // Load saved logged in info
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  // const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  if(isLoggedIn) {
    // User logged in
    if(createBtn) createBtn.classList.add("hidden");
    if(profileBtn) {
      profileBtn.classList.remove("hidden");
      profileBtn.textContent = `Your Profile`;
    }
  } else {
    // User logged out
    console.log("User not logged in");
    // Show "Create Account" button
    if(createBtn) createBtn.classList.remove("hidden");
    // Hide "Profile" button
    if(profileBtn) profileBtn.classList.add("hidden");
  }

  // Also check login status for review form if popup is already open
  checkLoginStatusForReviews();

  // Logout state
  const logoutBtn = document.getElementById("logout-btn");

  if(logoutBtn) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Update button text dynamically
    logoutBtn.textContent = isLoggedIn ? "Log out" : "Log in";

    logoutBtn.addEventListener("click", () => {
      if(isLoggedIn){
        const confirmLogout = confirm("Are you sure you want to log out?");
        if(confirmLogout) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("loggedInUser");
          alert("You have been logged out successfully");
          window.location.href = "homepage.html"
        }
      } else {
        alert("Redirecting to the login page...");
        window.location.href = "register.html"
      }
    });
  }
});