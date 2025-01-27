// SEARCH BAR SCRIPT START

const searchInputField = document.querySelector(".nav-search input");
const suggestionsList = document.querySelector(".suggestions");
const clearHistoryButton = document.getElementById("clear-history");
const loadingSpinner = document.getElementById("loading-spinner");
let currentIndex = -1;

// Debounce Function
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Display Skeleton Loaders
function showSkeletonLoaders(count = 5) {
  suggestionsList.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeletonItem = document.createElement("li");
    skeletonItem.className = "skeleton";
    suggestionsList.appendChild(skeletonItem);
  }
}

// Save Search History
function saveSearchHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(query)) {
    history.unshift(query); // Add new search at the start
    if (history.length > 5) history.pop(); // Limit to 5 recent searches
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
  displaySearchHistory(); // Update the history display
}

// Display Search History
function displaySearchHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (history.length > 0) {
    suggestionsList.innerHTML = history
      .map((item) => `<li role="option">${item}</li>`)
      .join("");
    toggleClearHistoryButton(true); // Show Clear History button when history is displayed
  } else {
    suggestionsList.innerHTML = "<li>No search history</li>";
    toggleClearHistoryButton(false); // Hide Clear History button if there's no history
  }
}

// Toggle Clear History Button Visibility
function toggleClearHistoryButton(show) {
  clearHistoryButton.style.display = show ? "inline-block" : "none";
}

// Fetch Suggestions with Alternative Proxy
searchInputField.addEventListener(
  "input",
  debounce(function () {
    const query = searchInputField.value.trim();

    if (query === "") {
      displaySearchHistory(); // Display search history or frequent searches
      return;
    }

    const proxyUrl = "https://api.allorigins.win/get?url=";
    const googleSuggestUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`;

    showSkeletonLoaders(); // Show skeleton loaders
    fetch(proxyUrl + encodeURIComponent(googleSuggestUrl))
      .then((response) => response.json())
      .then((data) => {
        const suggestions = JSON.parse(data.contents)[1]; // Extract suggestions from the response
        if (Array.isArray(suggestions)) {
          suggestionsList.innerHTML = suggestions
            .map((suggestion) => `<li role="option">${suggestion} <i class="ico srh-ico fa-solid fa-arrow-right" style="transform: rotate(-45deg);"></i></li>`)
            .join("");
          currentIndex = -1; // Reset index for navigation
          toggleClearHistoryButton(false); // Hide Clear History button when suggestions are active
        } else {
          suggestionsList.innerHTML = ""; // Clear if no suggestions
          toggleClearHistoryButton(false); // Hide Clear History button
        }
      })
      .catch((error) => console.error("Error fetching suggestions:", error));
  }, 300)
);

// Handle Suggestion Click
suggestionsList.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    searchInputField.value = event.target.textContent;
    suggestionsList.innerHTML = ""; // Clear suggestions
    saveSearchHistory(event.target.textContent); // Save to history
    performSearch(); // Trigger search on suggestion click
  }
});

// Keyboard Navigation for Suggestions
searchInputField.addEventListener("keydown", (event) => {
  const items = document.querySelectorAll(".suggestions li");

  if (event.key === "ArrowDown") {
    currentIndex = (currentIndex + 1) % items.length;
    highlightSuggestion(items, currentIndex);
  } else if (event.key === "ArrowUp") {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    highlightSuggestion(items, currentIndex);
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (currentIndex >= 0) {
      // Select suggestion
      searchInputField.value = items[currentIndex].textContent;
      saveSearchHistory(items[currentIndex].textContent); // Save to history
    }
    performSearch(); // Trigger search on Enter
  }
});

// Highlight Suggestions
function highlightSuggestion(items, index) {
  items.forEach((item, i) => {
    item.classList.toggle("highlighted", i === index);
  });
}

// Perform Google Search
function performSearch() {
  const query = searchInputField.value.trim();
  if (query) {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.location.href = googleSearchUrl;
  }
}

// Clear Search History with Loading Spinner
clearHistoryButton.addEventListener("click", () => {
  // Show loading spinner
  loadingSpinner.style.display = "inline-block";

  // Simulate a delay (for example, in case of network operations or large data)
  setTimeout(() => {
    // Clear search history from localStorage
    localStorage.removeItem("searchHistory");

    // Update UI: Clear the suggestions history in the search bar (optional)
    suggestionsList.innerHTML = "<li>No search history</li>";

    // Hide loading spinner once done
    loadingSpinner.style.display = "none";

    // Optionally, you can show a message that history was cleared
    alert("Search history has been cleared!");
    toggleClearHistoryButton(false); // Hide button after clearing history
  }, 1000); // Simulate a delay of 1 second
});

// SEARCH BAR SCRIPT END





// SEARCH HISTORY & FREQUENT SEARCHES

// Save Search History
function saveSearchHistory(query) {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Limit the history to 10 items
  if (history.length >= 10) {
    history.pop(); // Remove the least recent search
  }

  // Add the current search to the history (prevent duplicates)
  if (!history.includes(query)) {
    history.unshift(query);
  }

  // Save back to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

// Fetch and Display Search History
function displaySearchHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const suggestionsList = document.querySelector(".suggestions");

  if (history.length === 0) {
    suggestionsList.innerHTML = "<li style=''>No search history</li>";
    return;
  }

  suggestionsList.innerHTML = history
    .map(
      (term) => `
        <li role="option">${term}</li>
      `
    )
    .join("");
}

// Display Search History when input is empty
searchInputField.addEventListener("focus", displaySearchHistory);

// RANDOM TEXT SCRIPT START
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let iterations = 0;

document.querySelectorAll("span").forEach((span) => {
  span.addEventListener("mouseover", (event) => {
    const value = event.target.dataset.value;
    let animationFrameId;

    function animate() {
      event.target.innerText = value
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
      iterations++;

      if (iterations < value.length * 30) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        iterations = 0;
        cancelAnimationFrame(animationFrameId);
      }
    }

    animate();
  });
});
// RANDOM TEXT SCRIPT END

// OBJECT FOLLOWING MOUSE SCRIPT START
const blob = document.getElementById("blob");

document.body.onpointermove = (event) => {
  const { clientX, clientY } = event;
  blob.animate(
    {
      left: `${clientX}px`,
      top: `${clientY}px`,
    },
    { duration: 3000, fill: "forwards" }
  );
};
// OBJECT FOLLOWING MOUSE SCRIPT END

// TIME SCRIPT START
const timeH2 = document.querySelector("h2");
const timeP = document.querySelector("p");

function updateTime() {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:${seconds}`;
  const formattedDate = currentDate
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");

  timeH2.textContent = formattedTime;
  timeP.textContent = formattedDate;
}

// Call updateTime function initially to display current date and time
updateTime();

// Update time every second
setInterval(updateTime, 1000);
// TIME SCRIPT END

// SEARCH BAR SCRIPT END
