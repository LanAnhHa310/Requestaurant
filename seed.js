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
    info: "Modern Italian dining in Browne's Addition, featuring handmade pasta and fine wines."
  },
  {
    name: "Safari Room Fresh Grill & Bar",
    image: "https://placehold.co/300x300?text=Safari+Room",
    rating: "4.3★",
    price: "$$",
    atmosphere: "family",
    info: "Warm, inviting restaurant serving steaks, sandwiches, and breakfast inside the Davenport Tower."
  },
  {
    name: "Texas Roadhouse Spokane",
    image: "https://placehold.co/300x300?text=Texas+Roadhouse",
    rating: "4.2★",
    price: "$",
    atmosphere: "casual",
    info: "Lively steakhouse known for hand-cut steaks, peanuts on the floor, and a friendly crowd."
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