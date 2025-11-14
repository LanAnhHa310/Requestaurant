# Requestaurant
The restaurant research and suggestion application!

## Description
Requestaurant is a web-based application designed with the sole function of helping users find the best places to go out and eat good food!
To do this, requestaurant allows users to enter a wide variety of search parameters ranging from location to menu price average.
The application will then seach it's database for the best possible matches and display them to the user to choose from.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)
## Installation
You can run the requestaurant application via the following methods:
### Downloading & running with VSCode
To download requestaurant:
1. Navigate to the top-right, corner of the repositry.
2. Click on the green "Code" button and select "Download ZIP".
3. After downloading, extract the downloaded ZIP of requestaurant in a new blank directory.
4. Open the directory with VSCode.
5. In VSCode, download one of the following applications:
  - [Microsoft Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)
  - [HTML Play](https://marketplace.visualstudio.com/items?itemName=bianxianyang.htmlplay)
  - [Node.js](https://nodejs.org/) (v14 or higher)
  - [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
6. **Using Microsoft Preview**: right click the homepage.html file and select the "preview" option. A localhost window will appear with the application running.
7. **Using HTML Play**: Select the homepage.html file in the directory to run the application.
## Usage
Run the file locally:
- Clone the repo and open the folder.
- Install dependencies:
```bash
   npm install
```
- Start MongoDB:
```bash
   # On Mac/Linux
   mongod --dbpath ~/data/db
   
   # Or if installed via Homebrew
   brew services start mongodb-community
```
- Seed the database** (populate with sample restaurants):
```bash
   node seed.js
```
- Start the server:
```bash
   node server.js
```
- Open your browser: Navigate to `http://localhost:3000`

What you can do for front end simulation
1. Search and filter restaurant:
- In homepage.html, enter a query and set filters (price, rating, diet, atmosphere), then click Search.
- Results update instantly from a hard-coded dataset (no database yet).
2. View detail and add one review
- Click a restaurant card to open the details popup (modal).
- Add a rating and review → Submit.
3. Toggle dark mode
- Go to settings.html → turn Dark Mode on/off.
- Preference is saved in localStorage and persists on reload.
4. Toggle accessbility
- In settings.html, enable Accessibility (larger text, higher contrast, visible focus).
- Works together with Dark Mode.
5. Toggle perfomance mode
- In settings.html, enable Simplified view to reduce heavy images for faster loading.
6. Profile & Bookmark
- Use register.html to simulate account creation (sets localStorage.logInUser).
- Bookmark a restaurant from its card or popup; view in profile.html.

What you can do for back end:
1. Create an Account
2. Search for Restaurants
3. View Restaurant Details & Reviews
4. Submit a Review
5. Manage Your Reviews
6. Customize Settings
7. View Your Preferences

## Contributing
We use a simple branch-based flow with two active dev branches: jaxon and anh.
Only push directly to main for quick, low-risk fixes (docs/typos).
Each developer works on their own branch:
- Jaxon: jaxon
- Anh: anh
Direct commits to main allowed only for safe, quick fixes (e.g., README typo, small CSS tweak).

## Credits
This application was developed by the Gonzaga University Web-Development team 3: "Requestaurant" Its team members are:
  - Thi Lan Anh Ha
  - Jaxon Froderberg
