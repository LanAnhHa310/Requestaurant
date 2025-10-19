const searchForm = document.getElementById('searchForm');
const resultList = document.getElementById('resultList');
    
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
    
    // Fake search results example, used for testing
        const results = [
            `${query} in ${location || "your area"} (${price || "$$"} • ${rating || "Any"}★ • ${atmosphere || "Any atmosphere"})`,
            `Best ${dietary || ""} ${query} near ${location || "you"}`,
            `${query} with ${atmosphere || "cozy"} vibes`,
            `${query} restaurants in ${location || "nearby"}`
            ];
        
        results.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.className = 'result-item';
            resultList.appendChild(li);
        });
    });