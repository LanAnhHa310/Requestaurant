// Script to populate database with initial restaurant data for testing
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");

// Connect to database
mongoose.connect("mongodb://localhost:27017/requestaurant-db");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  seedDatabase();
});

// Restaurant data to seed
const restaurants = [
  {
    name: "Wild Sage American Bistro",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    rating: "4.8★",
    price: "$$$",
    atmosphere: "luxury",
    info: "Locally owned farm-to-table restaurant known for elegant dining and seasonal flavors.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Osprey Restaurant & Bar",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    rating: "4.2★",
    price: "$$",
    atmosphere: "casual",
    info: "Riverside dining with burgers, steaks, and cocktails, featuring scenic Spokane River views.",
    diet: "gluten-free",
    location: "Spokane Riverfront, Spokane, WA"
  },
  {
    name: "Wooden City Spokane",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    rating: "4.3★",
    price: "$$",
    atmosphere: "casual",
    info: "Downtown spot for wood-fired pizza, American comfort food, and signature cocktails.",
    diet: "vegetarian",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Clinkerdagger",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80",
    rating: "4.6★",
    price: "$$$$",
    atmosphere: "romantic",
    info: "Iconic steakhouse overlooking Spokane Falls, ideal for celebrations and date nights.",
    diet: "gluten-free",
    location: "Spokane Falls Overlook, Spokane, WA"
  },
  {
    name: "Italia Trattoria",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80",
    rating: "4.4★",
    price: "$$$",
    atmosphere: "romantic",
    info: "Modern Italian cuisine in Browne’s Addition with handmade pasta and curated wines.",
    diet: "vegetarian",
    location: "Browne’s Addition, Spokane, WA"
  },
  {
    name: "Safari Room Fresh Grill & Bar",
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=600&q=80",
    rating: "3.9★",
    price: "$$",
    atmosphere: "family",
    info: "Lively grill and bar inside the Davenport Tower serving steaks, sandwiches, and breakfast.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Texas Roadhouse Spokane",
    image: "https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=600&q=80",
    rating: "3.6★",
    price: "$",
    atmosphere: "casual",
    info: "Bustling steakhouse known for hand-cut steaks, fresh rolls, and a fun roadhouse vibe.",
    diet: "halal",
    location: "North Spokane, WA"
  },
  {
    name: "The Flying Goat",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    rating: "4.5★",
    price: "$$",
    atmosphere: "casual",
    info: "Neighborhood pizzeria offering creative wood-fired pies and craft beer in a cozy setting.",
    diet: "vegetarian",
    location: "Audubon/Downriver, Spokane, WA"
  },
  {
    name: "The Elk Public House",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    rating: "4.1★",
    price: "$$",
    atmosphere: "casual",
    info: "Classic Browne’s Addition pub known for comfort food, sandwiches, and a laid-back patio.",
    diet: "gluten-free",
    location: "Browne’s Addition, Spokane, WA"
  },
  {
    name: "Chaotic Baking & Coffee",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=600&q=80",
    rating: "3.8★",
    price: "$",
    atmosphere: "casual",
    info: "Cozy Spokane bakery and coffee shop offering pastries, espresso drinks, and quick bites.",
    diet: "vegetarian",
    location: "North Monroe District, Spokane, WA"
  },
  {
    name: "Sushi.com",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80",
    rating: "4.2★",
    price: "$$",
    atmosphere: "casual",
    info: "Popular downtown spot for sushi rolls, sashimi, and Japanese comfort dishes.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Inland Pacific Kitchen",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    rating: "4.5★",
    price: "$$$",
    atmosphere: "luxury",
    info: "Inventive seasonal menu with Pacific Northwest ingredients and a modern dining room.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Durkin’s Liquor Bar",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
    rating: "4.0★",
    price: "$$",
    atmosphere: "romantic",
    info: "Stylish downtown restaurant and bar serving elevated comfort food and craft cocktails.",
    diet: "kosher",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Frank’s Diner",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    rating: "4.1★",
    price: "$",
    atmosphere: "family",
    info: "Historic railcar diner serving hearty American breakfasts and classic comfort favorites.",
    diet: "gluten-free",
    location: "North Spokane, WA"
  },
  {
    name: "The Onion Taphouse & Grill",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    rating: "3.7★",
    price: "$$",
    atmosphere: "family",
    info: "Family-friendly taphouse with burgers, wings, and a wide selection of regional beers.",
    diet: "vegetarian",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Mary Lou’s Milk Bottle",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    rating: "3.9★",
    price: "$",
    atmosphere: "family",
    info: "Retro-style diner famous for milkshakes, burgers, and nostalgic Spokane charm.",
    diet: "vegetarian",
    location: "Garland District, Spokane, WA"
  },
  {
    name: "The Satellite Diner & Lounge",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    rating: "3.5★",
    price: "$",
    atmosphere: "casual",
    info: "Late-night favorite serving diner classics, cocktails, and hearty breakfasts.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "The Yards Bruncheon",
    image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=600&q=80",
    rating: "4.3★",
    price: "$$",
    atmosphere: "casual",
    info: "Brunch-focused eatery in Kendall Yards featuring inventive breakfast and lunch dishes.",
    diet: "vegetarian",
    location: "Kendall Yards, Spokane, WA"
  },
  {
    name: "Casper Fry",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    rating: "3.8★",
    price: "$$",
    atmosphere: "casual",
    info: "Southern-inspired kitchen with fried chicken, grits, and cocktails in a rustic setting.",
    diet: "halal",
    location: "South Perry District, Spokane, WA"
  },
  {
    name: "Iron Goat Brewing Co.",
    image: "https://images.unsplash.com/photo-1543810579-cb531fg2d9a8?auto=format&fit=crop&w=600&q=80",
    rating: "4.0★",
    price: "$",
    atmosphere: "casual",
    info: "Brewpub offering house-made beers, pizzas, and small plates in a relaxed taproom.",
    diet: "vegetarian",
    location: "Downtown/West End, Spokane, WA"
  },
  {
    name: "No-Li Brewhouse",
    image: "https://images.unsplash.com/photo-1543810579-73fc7e99e7b9?auto=format&fit=crop&w=600&q=80",
    rating: "4.1★",
    price: "$$",
    atmosphere: "casual",
    info: "Independent brewery with riverfront patio seating and a menu of pub favorites.",
    diet: "gluten-free",
    location: "Spokane Riverfront, Spokane, WA"
  },
  {
    name: "Zona Blanca Ceviche Bar",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    rating: "4.4★",
    price: "$$",
    atmosphere: "casual",
    info: "Trendy ceviche and seafood bar offering bold flavors and creative cocktails.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "RüT Bar & Kitchen",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
    rating: "4.3★",
    price: "$$",
    atmosphere: "casual",
    info: "Plant-based restaurant featuring creative vegan comfort food and a full bar.",
    diet: "vegan",
    location: "South Hill, Spokane, WA"
  },
  {
    name: "Mizuna Restaurant & Wine Bar",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
    rating: "4.5★",
    price: "$$$",
    atmosphere: "romantic",
    info: "Cozy downtown restaurant with upscale seasonal dishes and vegetarian-friendly options.",
    diet: "vegetarian",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Pho Van Spokane",
    image: "https://images.unsplash.com/photo-1525755564282-1c024a37a87d?auto=format&fit=crop&w=600&q=80",
    rating: "4.0★",
    price: "$",
    atmosphere: "casual",
    info: "Vietnamese restaurant serving pho, vermicelli bowls, and other traditional dishes.",
    diet: "gluten-free",
    location: "Sprague Avenue, Spokane, WA"
  },
  {
    name: "Domini Sandwiches",
    image: "https://images.unsplash.com/photo-1603046891744-56abb8816ad6?auto=format&fit=crop&w=600&q=80",
    rating: "3.7★",
    price: "$",
    atmosphere: "casual",
    info: "Simple counter-service deli known for huge sandwiches and no-frills atmosphere.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "Veraci Pizza Spokane",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    rating: "4.2★",
    price: "$$",
    atmosphere: "family",
    info: "Wood-fired pizza with thin crusts and fresh toppings, great for families and groups.",
    diet: "vegetarian",
    location: "North Spokane, WA"
  },
  {
    name: "Ferraro’s Italian Restaurant & Wine Bar",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80",
    rating: "3.9★",
    price: "$$",
    atmosphere: "romantic",
    info: "Neighborhood Italian restaurant offering pasta, pizza, and an extensive wine list.",
    diet: "vegetarian",
    location: "North Spokane, WA"
  },
  {
    name: "Ruins Spokane",
    image: "https://images.unsplash.com/photo-1503891450243-d8cf4ff70f8b?auto=format&fit=crop&w=600&q=80",
    rating: "4.1★",
    price: "$$",
    atmosphere: "casual",
    info: "Eclectic rotating menu with global flavors, small plates, and an intimate vibe.",
    diet: "gluten-free",
    location: "Downtown Spokane, WA"
  },
  {
    name: "The Palm Court Grill",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
    rating: "4.3★",
    price: "$$$",
    atmosphere: "luxury",
    info: "Elegant dining room inside the Historic Davenport serving steaks, seafood, and fine wines.",
    diet: "kosher",
    location: "Downtown Spokane, WA"
  }
];


async function seedDatabase() {
  try {
    // Clear existing restaurants (optional - remove if you want to keep existing data)
    await Restaurant.deleteMany({});
    console.log("Cleared existing restaurants");

    // Insert all restaurants
    await Restaurant.insertMany(restaurants);
    console.log(`Successfully added ${restaurants.length} restaurants to database`);

    // Display what was added
    const allRestaurants = await Restaurant.find();
    console.log("\nRestaurants in database:");
    allRestaurants.forEach(r => console.log(`- ${r.name} (${r.price})`));

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}