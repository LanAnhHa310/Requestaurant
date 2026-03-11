# Requestaurant
The restaurant research and suggestion application!

## Description
Requestaurant is a web-based application designed with the sole function of helping users find the best places to go out and eat good food!
To do this, requestaurant allows users to enter a wide variety of search parameters ranging from location to menu price average.
The application will then seach it's database for the best possible matches and display them to the user to choose from.

Team project developed with classmates.

Original course repository:
https://github.com/GU-Web-Dev-2025/final-project-requestaurant

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
- Seed the database** (populate with sample restaurants), if you database file is seed.js:
```bash
   node seed.js
```
- Start the server:
```bash
   node server.js
```
- Open your browser: Navigate to `http://localhost:3000`

What you can do for front end simulation
1. Users must be able to switch between light and dark mode.
2. Users must be able to enable performance mode for a simplified, faster-loading view.
3. Users must be able to enable accessibility mode for improved visibility.
4. Users must be able to view a responsive interface that adjusts to different screen sizes.
5. Users must be able to open restaurant details in a popup window.
6. Users must be able to view a restaurant’s location through an embedded Google Map.
7. Users must be able to submit only one review per restaurant per account.

What you can do for back end:
1. Users must be able to create an account(username, email, password → stored in MongoDB).
2. Users must be able to save personal preferences (diet, price range, etc.)
3. Users must be able to search restaurants from MongoDB using filters.
4. Users must be able to submit, edit, and delete your own reviews.
6. Users must be able to save/bookmark restaurants.

## Contributing
We use a simple branch-based flow with active dev branches: jaxon and anh.
Only push directly to main for quick, low-risk fixes (docs/typos).
Both developers publish their work to a branch before merging to main.
Direct commits to main allowed only for safe, quick fixes (e.g., README typo, small CSS tweak).

## Credits
This application was developed by the Gonzaga University Web-Development team 3: "Requestaurant" Its team members are:
  - Thi Lan Anh Ha
  - Jaxon Froderberg
