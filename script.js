// ============================
// Restaurant Search + Review
// ============================

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
        name: "Ocean Breeze Grill",
        image: "",
        rating: "4.5★",
        price: "$$",
        atmosphere: "Casual",
        info: "Fresh seafood with ocean views and a relaxing ambiance.",
      },
      {
        name: "Pasta & Co.",
        image: "",
        rating: "4.8★",
        price: "$$$",
        atmosphere: "Romantic",
        info: "Authentic Italian pasta and fine wine in a cozy setting.",
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
      const card = document.createElement("div");
      card.className = "restaurant-card";
      card.innerHTML = `
        <img src="${r.image}" alt="${r.name}">
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

// ============================
// Popup + Review
// ============================
function openPopup(r) {
  popupImg.src = r.image;
  restaurantName.textContent = r.name;
  restaurantInfo.textContent = r.info;
  restaurantRating.textContent = `${r.price} • ${r.atmosphere} • ${r.rating}`;
  currentRestaurant = r.name;
  loadReviews(r.name);
  popup.classList.remove("hidden");
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
  console.log("✅ JS loaded");

  const darkToggleBtn = document.getElementById("dark-mode");
  const accessToggleBtn = document.getElementById("disability-mode");

  // Load saved preferences
  const savedTheme = localStorage.getItem("theme");
  const savedAccessibility = localStorage.getItem("accessibility");

  // Apply to every page
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  if (savedAccessibility === "on") document.body.classList.add("disability-mode");

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
});
