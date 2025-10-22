// Restaurant Search + Review

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
const restaurantReviews = {}; // stores reviews in memory

let revObj = null; // stores which restaurant is being looked at.

// Handle search
if (searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("q").value.trim().toLowerCase();
    resultList.innerHTML = "";

    if (!query) {
      alert("Please enter a search term!");
      return;
    }

    // Example fake dataset
    const results = [
      {
        name: "Wild Sage American Bistro",
        image: "https://placehold.co/300x300?text=Wild+Sage+American+Bistro",
        rating: "4.8★",
        price: "$$$",
        atmosphere: "luxury",
        info: "Locally owned farm-to-table restaurant known for elegant dining and seasonal flavors."
      },
      {
        name: "Osprey Restaurant & Bar",
        image: "https://placehold.co/300x300?text=Osprey+Restaurant+%26+Bar",
        rating: "4.6★",
        price: "$$",
        atmosphere: "casual",
        info: "Relaxed riverside restaurant offering burgers, steaks, and craft cocktails with outdoor seating."
      },
      {
        name: "Wooden City Spokane",
        image: "https://placehold.co/300x300?text=Wooden+City",
        rating: "4.5★",
        price: "$$",
        atmosphere: "casual",
        info: "Downtown spot for hearty American comfort food, wood-fired pizza, and signature cocktails."
      },
      {
        name: "Clinkerdagger",
        image: "https://placehold.co/300x300?text=Clinkerdagger",
        rating: "4.7★",
        price: "$$$$",
        atmosphere: "romantic",
        info: "Iconic Spokane steakhouse overlooking the river, perfect for date nights and celebrations."
      },
      {
        name: "Italia Trattoria",
        image: "https://placehold.co/300x300?text=Italia+Trattoria",
        rating: "4.7★",
        price: "$$$",
        atmosphere: "romantic",
        info: "Modern Italian dining in Browne’s Addition, featuring handmade pasta and fine wines."
      },
      {
        name: "Safari Room Fresh Grill & Bar",
        image: "https://placehold.co/300x300?text=Safari+Room",
        rating: "4.3★",
        price: "$$",
        atmosphere: "family-friendly",
        info: "Warm, inviting restaurant serving steaks, sandwiches, and breakfast inside the Davenport Tower."
      },
      {
        name: "Texas Roadhouse Spokane",
        image: "https://placehold.co/300x300?text=Texas+Roadhouse",
        rating: "4.2★",
        price: "$",
        atmosphere: "casual",
        info: "Lively steakhouse known for hand-cut steaks, peanuts on the floor, and a friendly crowd."
      },
    ];    

    const filtered = results.filter((r) => {
        const searchableText = `
          ${r.name} ${r.info} ${r.atmosphere} ${r.price} ${r.rating}
        `.toLowerCase();
        return searchableText.includes(query);
    });

    if (filtered.length === 0) {
      resultList.innerHTML = `<p>No restaurants found for "${query}".</p>`;
      return;
    }

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
  });
}


// Popup + Review
function openPopup(r) {
  popupImg.src = r.image;
  restaurantName.textContent = r.name;
  restaurantInfo.textContent = r.info;
  restaurantRating.textContent = `${r.price} • ${r.atmosphere} • ${r.rating}`;
  currentRestaurant = r.name;
  loadReviews(r.name);
  popup.classList.remove("hidden");

  // Store latest popup viewed in case a review is posted:
  revObj = restaurantReviews[r.name];
  console.log(`Stored viewed restaurant: ${r.name}`);
}

if(closePopup) {
  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
}

if(reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const rating = reviewRatingSelect.value;
    const text = reviewText.value.trim();
  
    if (!rating || !text) {
      alert("Please complete both fields before submitting.");
      return;
    }

    // =================================================================================
    // If the user fills out both the review text and the rating, store in "database":
    
    // Create the new review item:
    let newReview = {
      "image": revObj.image,
      "name": revObj.name,
      "info": revObj.info,
      "rating": `${revObj.price} • ${revObj.atmosphere} • ${revObj.rating}`,
      "reviewRating": rating,
      "reviewText": text,
    };

    // Store the review Item:
    localStorage.setItem( "firstReview", JSON.stringify(newReview) );

    // =================================================================================
  
    if (!restaurantReviews[currentRestaurant]) {
      restaurantReviews[currentRestaurant] = [];
    }
    restaurantReviews[currentRestaurant].push({ rating, text });
  
    loadReviews(currentRestaurant);
    reviewForm.reset();
  });
}

function loadReviews(name) {
  reviewsList.innerHTML = "";
  const reviews = restaurantReviews[name];
  if (!reviews || reviews.length === 0) {
    reviewsList.innerHTML = "<p>No reviews yet. Be the first to leave one!</p>";
    return;
  }
  reviews.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `${r.rating}★ - ${r.text}`;
    reviewsList.appendChild(li);
  });
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
  
  // Load saved logged in info
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

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