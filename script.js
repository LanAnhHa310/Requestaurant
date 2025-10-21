const searchForm = document.getElementById('searchForm');
const resultList = document.getElementById('resultList');

// run this only when we're on homepage

if(searchForm) {
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const query = document.getElementById('q').value.trim();
        const price = document.getElementById('price').value;
        const rating = document.getElementById('rating').value;
        const location = document.getElementById('location').value.trim();
        const dietary = document.getElementById('dietary').value;
        const atmosphere = document.getElementById('atmosphere').value;
        
        resultList.innerHTML = '';
        
        if (query === '') {
            alert('Please enter a search term!');
            return;
        }
        
        // Generate 50 fake results for scrolling test
        const results = [];
        for (let i = 1; i <= 50; i++) {
            results.push(
            `${i}. ${query} restaurant in ${location || "your area"} (${price || "$$"} • ${rating || "Any"}★ • ${atmosphere || "Any atmosphere"})`
            );
        }
        results.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.className = 'result-item';
            resultList.appendChild(li);
        });
    });
}

// Dark mode
const darkToggleBtn = document.getElementById('dark-mode');

// Apply saved theme on all pages
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (darkToggleBtn) darkToggleBtn.checked = true;
  }
});

// Add event listener to toggle button
if(darkToggleBtn) {
    darkToggleBtn.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
        // Save the user's preference in localStorage so it stays after refresh
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}


// Accessibility
const accessToggleBtn = document.getElementById('disability-mode');

window.addEventListener("load", () => {
    const savedAccessibility = localStorage.getItem("theme");
    if (savedAccessibility === "on") {
        document.body.classList.add("disability-mode");
        if (accessToggleBtn) accessToggleBtn.checked = true;
    }
});

if(accessToggleBtn) {
    accessToggleBtn.addEventListener("change", () => {
        document.body.classList.toggle("disability-mode");
        if(document.body.classList.contains("disability-mode")) {
            localStorage.setItem("theme", "on");
        } else {
            localStorage.setItem("theme", "off");
        }
    });
}