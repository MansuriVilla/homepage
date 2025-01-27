// SEARCH BAR SCRIPT START

const searchInputField = document.querySelector(".nav-search input");
const suggestionsList = document.querySelector(".suggestions");
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

// Fetch Suggestions with Alternative Proxy
searchInputField.addEventListener(
  "input",
  debounce(function () {
    const query = searchInputField.value.trim();

    if (query === "") {
      suggestionsList.innerHTML = "";
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
            .map((suggestion) => `<li role="option">${suggestion}</li>`)
            .join("");
          currentIndex = -1; // Reset index for navigation
        } else {
          suggestionsList.innerHTML = ""; // Clear if no suggestions
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

// SEARCH BAR SCRIPT END




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
