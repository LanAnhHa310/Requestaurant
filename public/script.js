// Restaurant Search + Review webpage

// Elements
const searchForm = document.getElementById("searchForm");
const resultList = document.getElementById("result-grid");
const popup = document.getElementById("restaurant-popup");
const closePopup = document.getElementById("close-popup");
const popupImg = document.getElementById("popup-image");

const restaurantMap = document.getElementById("restaurant-map"); // Holds the popup Iframe map.
const restaurantAddress = document.getElementById("restaurant-address"); // Holds the restaurant address.

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
// ==================== SEARCH FUNCTIONALITY ====================

// Handle search - fetch from DB then filter based on form inputs
if (searchForm) {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = document.getElementById("q").value.trim().toLowerCase();
    const priceFilter = document.getElementById("price")?.value || "";
    const ratingFilter = document.getElementById("rating")?.value || "";      // "4", "3", "2"
    const locationInput = document.getElementById("location")?.value.trim().toLowerCase() || "";
    const dietaryFilter = document.getElementById("dietary")?.value || "";    // "vegan", "vegetarian", ...
    const atmosphereFilter = document.getElementById("atmosphere")?.value || "";

    resultList.innerHTML = "<p>Loading restaurants...</p>";

    try {
      const response = await fetch("/api/restaurants");
      if (!response.ok) throw new Error("Failed to fetch restaurants");

      const results = await response.json();

      const filtered = results.filter((r) => {
        // Normalize rating to a number (handles "4.3★" strings)
        let numericRating = NaN;
        if (typeof r.rating === "string") {
          numericRating = parseFloat(r.rating.replace("★", "").trim());
        } else if (typeof r.rating === "number") {
          numericRating = r.rating;
        }

        const searchableText = `
          ${r.name || ""} 
          ${r.info || ""} 
          ${r.atmosphere || ""} 
          ${r.price || ""} 
          ${r.rating || ""} 
          ${r.diet || ""} 
        `.toLowerCase();

        // 1. Text search
        // - if no query => allow all (filters still apply)
        // - if query === "food" => also allow all (generic search)
        const matchesText =
          !query ||
          query === "food" ||
          searchableText.includes(query);

        // 2. Location: for now treat as extra keyword filter
        // (later you can add a location field in the DB and use it directly)
        const matchesLocation =
          !locationInput || searchableText.includes(locationInput);

        // 3. Price filter
        const matchesPrice =
          !priceFilter || r.price === priceFilter;

        // 4. Dietary restrictions
        const matchesDietary =
          !dietaryFilter ||
          (r.diet && r.diet.toLowerCase() === dietaryFilter.toLowerCase());

        // 5. Atmosphere filter
        const matchesAtmosphere =
          !atmosphereFilter ||
          (r.atmosphere &&
            r.atmosphere.toLowerCase() === atmosphereFilter.toLowerCase());

        // 6. Rating filter: "4" means 4★ and above
        const matchesRating =
          !ratingFilter ||
          (!isNaN(numericRating) && numericRating >= parseFloat(ratingFilter));

        return (
          matchesText &&
          matchesLocation &&
          matchesPrice &&
          matchesDietary &&
          matchesAtmosphere &&
          matchesRating
        );
      });

      if (filtered.length === 0) {
        resultList.innerHTML = `<p>No restaurants found for "${query || "your filters"}".</p>`;
        return;
      }

      resultList.innerHTML = "";
      filtered.forEach((r) => {
        const imgSrc =
          r.image && r.image.trim() !== ""
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
            <p class="diet-tag">${r.diet ? `Diet: ${r.diet}` : ""}</p>
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
  // -------------------------------------------------------- ADD MAP STUFF HERE.
  restaurantMap.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42847.50962620832!2d-116.16377163392185!3d47.8401871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53610ee1aef238dd%3A0x6ec008ec2cac0ff2!2sNowhere%20Creek!5e0!3m2!1sen!2sus!4v1764804180574!5m2!1sen!2sus";
  restaurantAddress.textContent = "Address: Middle of nowhere, really.";

  // Toggle map display / address when clicking on "Show Location" button
  let popupToggleBtn = document.getElementById("mapToggleBtn");
  popupToggleBtn.onclick = () => {
    popupImg.classList.toggle("hidden");
    restaurantMap.classList.toggle("hidden");
  };
  // Check if performance mode is enabled:
  if (localStorage.getItem("performance") === "on") {
    restaurantMap.classList.add("hidden");
    popupToggleBtn.classList.add("hidden");
    restaurantAddress.classList.toggle("hidden");
  }

  restaurantName.textContent = r.name;
  restaurantInfo.textContent = r.info;
  restaurantRating.textContent = `${r.price} • ${r.atmosphere} • ${r.rating}`;
  currentRestaurant = r; // Store full restaurant object (not just name)

  // Activate bookmark function when clicking on "save restaurant" button
  document.getElementById("bookmark-btn").onclick = () => {
    bookmarkRestaurant(currentRestaurant);
  };

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
}111

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
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        // Show specific duplicate-review message if present
        alert(err.error || "Failed to submit review.");
        return;
      }
      
      const result = await response.json();
      console.log("Review saved:", result);
      
      //Reload reviews and reset form
      await loadReviews(currentRestaurant.name);
      reviewForm.reset();
      alert("Review submitted successfully!");      
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Failed to submit review. Please try again.")
    }
  }
)};

// bookmark functionality:
// checks who the logged-in user is(from localStorage)
// if no one logged in show alert to log in and stop
// send a POST request to /api/bookmark with username, restaurant
// wait for server's reply
// read and parse the server's json
// show server's message in alert

async function bookmarkRestaurant(restaurant) {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    alert("Please log in to bookmark restaurants!");
    return;
  }

  // Get username from localStorage
  // Prefer currentUser, fall back to loggedInUser
  let username = localStorage.getItem("currentUser");
  if (!username) {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        username = parsed.username;
      } catch (e) {
        console.error("Error parsing loggedInUser:", e);
      }
    }
  }

  if (!username) {
    alert("Could not detect logged-in user. Please log in again.");
    return;
  }

  // Send bookmark to backend
  try {
    const response = await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, restaurant }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Bookmark request failed");
    }

    const data = await response.json();
    alert(data.message || "Bookmark added!");
  } catch (err) {
    console.error("Error bookmarking:", err);
    alert("Something went wrong while bookmarking. Please try again.");
  }

}

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

  // Dark mode and accessbility and performance:
  const darkToggleBtn = document.getElementById("dark-mode");
  const accessToggleBtn = document.getElementById("disability-mode");
  const performToggleBtn = document.getElementById("performance-mode");

  // Load saved preferences:
  const savedTheme = localStorage.getItem("theme");
  const savedAccessibility = localStorage.getItem("accessibility");
  const savedPerform = localStorage.getItem("performance");

  // Apply to every page:
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
  const prefSearchBtn = document.getElementById("prefLoadBtn");

  // Get the ID of the button with auto-fills the search form with user preferences
  prefSearchBtn.addEventListener("click", searchWithPreferences);
  
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
    // Toggle search-by-preference button:
    if( prefSearchBtn ) profileBtn.classList.remove("hidden");
  } else {
    // User logged out
    console.log("User not logged in");
    // Show "Create Account" button
    if(createBtn) createBtn.classList.remove("hidden");
    // Hide "Profile" button
    if(profileBtn) profileBtn.classList.add("hidden");
    // Hide search-by-preferences button
    if( prefSearchBtn ) prefSearchBtn.classList.add("hidden");
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